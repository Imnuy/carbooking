import { queryWithEncoding } from '@/lib/db';

export interface CarTypeOption {
  id: number;
  car_type: string;
}

const DEFAULT_CAR_TYPES = [
  'รถตู้นั่งบรรทุก',
  'รถยนต์บรรทุก',
  'รถยนต์นั่งบรรทุก4ประตู',
] as const;

let carTypeSchemaReady = false;

function normalizeCarTypeName(value?: string | null, model?: string | null) {
  const source = `${value ?? ''} ${model ?? ''}`.toLowerCase().replace(/\s+/g, '');

  if (!source) {
    return 'รถยนต์นั่งบรรทุก4ประตู';
  }

  if (source.includes('commuter') || source.includes('รถตู้') || source.includes('รถตู้นั่งบรรทุก') || source.includes('van')) {
    return 'รถตู้นั่งบรรทุก';
  }

  if (source.includes('รถยนต์บรรทุก') || source.includes('truck') || source.includes('pickup') || source.includes('d-max')) {
    return 'รถยนต์บรรทุก';
  }

  if (source.includes('4ประตู') || source.includes('รถยนต์นั่ง4ประตู') || source.includes('รถยนต์นั่งบรรทุก4ประตู')) {
    return 'รถยนต์นั่งบรรทุก4ประตู';
  }

  return value?.trim() || 'รถยนต์นั่งบรรทุก4ประตู';
}

async function ensureCarTypeForeignKey() {
  const rows = await queryWithEncoding(
    `SELECT constraint_name
     FROM information_schema.table_constraints
     WHERE table_name = 'cars'
       AND constraint_type = 'FOREIGN KEY'
       AND constraint_name = 'cars_car_type_id_fkey'`
  ) as { constraint_name: string }[];

  if (rows.length === 0) {
    await queryWithEncoding(
      'ALTER TABLE cars ADD CONSTRAINT cars_car_type_id_fkey FOREIGN KEY (car_type_id) REFERENCES car_type(id) ON DELETE SET NULL'
    );
  }
}

export async function ensureCarTypeSchema() {
  if (carTypeSchemaReady) {
    return;
  }

  await queryWithEncoding('ALTER TABLE cars ADD COLUMN IF NOT EXISTS car_number VARCHAR(50)');
  await queryWithEncoding('ALTER TABLE cars ADD COLUMN IF NOT EXISTS car_type VARCHAR(100)');
  await queryWithEncoding('CREATE TABLE IF NOT EXISTS car_type (id SERIAL PRIMARY KEY, car_type VARCHAR(100) NOT NULL UNIQUE)');
  await queryWithEncoding('ALTER TABLE cars ADD COLUMN IF NOT EXISTS car_type_id INTEGER');

  for (const name of DEFAULT_CAR_TYPES) {
    await queryWithEncoding(
      'INSERT INTO car_type (car_type) VALUES ($1) ON CONFLICT (car_type) DO NOTHING',
      [name]
    );
  }

  const legacyCars = await queryWithEncoding(
    `SELECT id, car_type, model
     FROM cars
     WHERE car_type_id IS NULL`
  ) as { id: number; car_type: string | null; model: string | null }[];

  for (const car of legacyCars) {
    const normalizedName = normalizeCarTypeName(car.car_type, car.model);

    const upserted = await queryWithEncoding(
      `INSERT INTO car_type (car_type)
       VALUES ($1)
       ON CONFLICT (car_type)
       DO UPDATE SET car_type = EXCLUDED.car_type
       RETURNING id`,
      [normalizedName]
    ) as { id: number }[];

    const carTypeId = upserted[0]?.id;

    if (!carTypeId) {
      continue;
    }

    await queryWithEncoding(
      'UPDATE cars SET car_type_id = $1, car_type = $2 WHERE id = $3',
      [carTypeId, normalizedName, car.id]
    );
  }

  await ensureCarTypeForeignKey();
  carTypeSchemaReady = true;
}

export async function getCarTypes() {
  await ensureCarTypeSchema();
  return await queryWithEncoding('SELECT id, car_type FROM car_type ORDER BY id ASC') as CarTypeOption[];
}

export async function resolveCarTypeId(input: { car_type_id?: number | null; car_type?: string | null; model?: string | null }) {
  await ensureCarTypeSchema();

  if (input.car_type_id) {
    return input.car_type_id;
  }

  const normalizedName = normalizeCarTypeName(input.car_type, input.model);
  const rows = await queryWithEncoding(
    `INSERT INTO car_type (car_type)
     VALUES ($1)
     ON CONFLICT (car_type)
     DO UPDATE SET car_type = EXCLUDED.car_type
     RETURNING id`,
    [normalizedName]
  ) as { id: number }[];

  return rows[0]?.id ?? null;
}
