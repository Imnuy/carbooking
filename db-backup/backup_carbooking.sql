--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking_status; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking_status (
    id integer NOT NULL,
    code character varying(3) NOT NULL,
    status character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100)
);


ALTER TABLE public.booking_status OWNER TO admin;

--
-- Name: booking_status_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.booking_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_status_id_seq OWNER TO admin;

--
-- Name: booking_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.booking_status_id_seq OWNED BY public.booking_status.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    requester_name character varying(255),
    requester_position character varying(255),
    car_id integer,
    driver_name character varying(150),
    supervisor_name character varying(255),
    supervisor_position character varying(255),
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    destination character varying(255) NOT NULL,
    purpose text,
    fuel_reimbursement character varying(100),
    distance numeric(10,2),
    passengers integer,
    trip_type character varying(20) DEFAULT 'internal'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    trip_id integer,
    driver_id integer,
    CONSTRAINT bookings_trip_type_check CHECK (((trip_type)::text = ANY ((ARRAY['internal'::character varying, 'external'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO admin;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO admin;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: cars; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.cars (
    id integer NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    license_plate character varying(50) NOT NULL,
    seats integer,
    car_type character varying(100),
    image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100),
    is_active boolean DEFAULT true,
    car_number character varying(50)
);


ALTER TABLE public.cars OWNER TO admin;

--
-- Name: cars_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cars_id_seq OWNER TO admin;

--
-- Name: cars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;


--
-- Name: driver_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.driver_type (
    id integer NOT NULL,
    code character varying(2) NOT NULL,
    driver_type character varying(100) NOT NULL
);


ALTER TABLE public.driver_type OWNER TO admin;

--
-- Name: driver_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.driver_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_type_id_seq OWNER TO admin;

--
-- Name: driver_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.driver_type_id_seq OWNED BY public.driver_type.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    fullname character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100),
    driver_type_code character varying(2) DEFAULT '01'::character varying NOT NULL
);


ALTER TABLE public.drivers OWNER TO admin;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_id_seq OWNER TO admin;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.trips (
    id integer NOT NULL,
    car_id integer,
    driver_id integer,
    start_date_time timestamp without time zone NOT NULL,
    end_date_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(255),
    updated_by character varying(255)
);


ALTER TABLE public.trips OWNER TO admin;

--
-- Name: trips_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trips_id_seq OWNER TO admin;

--
-- Name: trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.trips_id_seq OWNED BY public.trips.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying,
    fullname character varying(150),
    department character varying(150),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: booking_status id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_status ALTER COLUMN id SET DEFAULT nextval('public.booking_status_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- Name: driver_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.driver_type ALTER COLUMN id SET DEFAULT nextval('public.driver_type_id_seq'::regclass);


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: trips id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.trips ALTER COLUMN id SET DEFAULT nextval('public.trips_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: booking_status; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.booking_status (id, code, status, description, created_at, created_by, updated_at, updated_by) FROM stdin;
1	001	รอจัดรถ	การจองรถที่รอการจัดรถให้	2026-03-16 19:50:38.561058	admin	2026-03-16 20:18:14.624049	\N
2	002	จัดรถแล้ว	การจองรถที่ได้รับการจัดรถแล้ว	2026-03-16 19:50:38.561058	admin	2026-03-16 20:18:17.007328	\N
3	003	ปฏิเสธ	การจองรถที่ถูกปฏิเสธ	2026-03-16 19:50:38.561058	admin	2026-03-16 20:18:19.413759	\N
4	004	เสร็จสิ้น	การจองรถที่ดำเนินการเสร็จสิ้นแล้ว	2026-03-16 19:50:38.561058	admin	2026-03-16 20:18:21.567163	\N
5	005	ยกเลิก	การจองรถที่ถูกยกเลิกโดยผู้จอง	2026-03-16 19:50:38.561058	admin	2026-03-16 20:18:23.574178	\N
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.bookings (id, user_id, requester_name, requester_position, car_id, driver_name, supervisor_name, supervisor_position, start_time, end_time, destination, purpose, fuel_reimbursement, distance, passengers, trip_type, created_at, created_by, updated_at, updated_by, status, trip_id, driver_id) FROM stdin;
1	1	นายทดสอบ ระบบหนึ่ง	นักวิเคราะห์ระบบ	1	\N	นายแพทย์สมชาย ใจดี	หัวหน้าสำนักงานสาธารณสุขจังหวัด	2026-03-16 01:30:00	2026-03-16 09:30:00	โรงพยาบาลพุทธชินราช	ประชุมประเมินผลงานสุขภาพจังหวัด	ตามเกณฑ์	\N	3	internal	2026-03-16 15:38:58.300204	admin	2026-03-17 13:28:54.8035	\N	002	1	\N
2	1	นางสาวรวดเร็ว ทันใจ	พนักงานสาธารณสุข	1	\N	นางสาวมาลี รักษาดี	หัวหน้ากลุ่มงานบริการ	2026-03-16 01:30:00	2026-03-16 09:30:00	กระทรวงสาธารณสุข	ตรวจเยี่ยมสถานพยาบาลปฐมภูมิ	ไม่รับ	\N	2	internal	2026-03-16 15:39:00.748064	admin	2026-03-17 13:28:54.8183	\N	002	3	\N
4	1	นางสาวศิริวรรณ ภูสำสัย	นักวิชาการสาธารณสุข	1	Somchai Jaidee	นายแพทย์วีระชัย มีจิต	ผู้อำนวยการโรงพยาบาล	2026-03-18 08:30:00	2026-03-18 16:30:00	สำนักงานสาธารณสุขจังหวัดพิษณุโลกและสำนักงานสาธารณสุขอำเภอ	ประชุมวางแผนงานสาธารณสุขประจำเดือน	ตามเกณฑ์	126.50	6	internal	2026-03-16 22:46:20.374814	codex-test	2026-03-17 13:28:54.828279	codex-test-fix	002	5	\N
37	1	นายทดสอบ จองรถ	เจ้าหน้าที่ทดสอบระบบ	1	คนขับรถ ทดสอบ 1	นางสาวผู้ควบคุม รถ	หัวหน้างานทดสอบ	2026-03-17 01:30:00	2026-03-17 09:30:00	ศาลากลางจังหวัดพิษณุโลก	ทดสอบการสร้างใบขอใช้รถจากหน้า bookings	หน่วยงานต้นสังกัด	15.00	2	internal	2026-03-17 12:13:40.528514	requester	2026-03-17 13:28:54.841761	admin	002	7	1
3	1	นายเดินทาง บ่อย	พนักงานขับรถ	1	คนขับรถ ทดสอบ 1	นายสมศักดิ์ รักงาม	หัวหน้างานขนส่ง	2026-03-16 01:30:00	2026-03-16 09:30:00	สำนักงานสาธารณสุขจังหวัด	ส่งเอกสารทางการแพทย์ไปโรงพยาบาลส่งกลับ	ตามจริง	\N	4	internal	2026-03-16 15:39:03.078622	admin	2026-03-17 14:02:28.861949	admin	002	9	1
\.


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cars (id, brand, model, license_plate, seats, car_type, image_url, created_at, created_by, updated_at, updated_by, is_active, car_number) FROM stdin;
1	Toyota	Commuter	นข 1234	12	รถตู้นั่งบรรทุก	\N	2026-03-16 15:38:42.605337	admin	2026-03-16 16:08:13.821644	\N	t	\N
2	Honda	CR-V	กท 5678	5	รถยนต์บรรทุก	\N	2026-03-16 15:38:44.874594	admin	2026-03-16 16:08:13.821644	\N	t	\N
3	Toyota	Commuter	ฮน 9999	12	รถตู้นั่งบรรทุก	\N	2026-03-16 15:38:48.117981	admin	2026-03-16 16:08:13.821644	\N	t	\N
4	Isuzu	D-Max	ถศ 4321	5	รถยนต์นั่งบรรทุก4ประตู	\N	2026-03-16 15:38:50.846323	admin	2026-03-16 16:08:13.821644	\N	t	\N
\.


--
-- Data for Name: driver_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.driver_type (id, code, driver_type) FROM stdin;
1	01	พนักงานขับรถเป็นครั้งคราว
2	02	พนักงานขับรถยนต์
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.drivers (id, fullname, is_active, note, created_at, created_by, updated_at, updated_by, driver_type_code) FROM stdin;
1	คนขับรถ ทดสอบ 1	t	พนักงานขับรถประจำ	2026-03-16 16:07:20.261433	admin	2026-03-16 16:07:20.261433	\N	01
2	คนขับรถ ทดสอบ 2	t	พนักงานขับรถชั่วคราว	2026-03-16 16:07:20.261433	admin	2026-03-16 16:07:20.261433	\N	01
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.trips (id, car_id, driver_id, start_date_time, end_date_time, created_at, updated_at, created_by, updated_by) FROM stdin;
1	1	\N	2026-03-16 01:30:00	2026-03-16 09:30:00	2026-03-16 15:38:58.3	2026-03-17 13:28:54.793325	migration	migration
3	1	\N	2026-03-16 01:30:00	2026-03-16 09:30:00	2026-03-16 15:39:00.748	2026-03-17 13:28:54.81154	migration	migration
5	1	\N	2026-03-18 08:30:00	2026-03-18 16:30:00	2026-03-16 22:46:20.374	2026-03-17 13:28:54.823159	migration	migration
7	1	1	2026-03-17 01:30:00	2026-03-17 09:30:00	2026-03-17 12:13:40.528	2026-03-17 13:28:54.835131	migration	migration
2	1	\N	2026-03-16 01:30:00	2026-03-16 09:30:00	2026-03-16 15:38:58.3	2026-03-17 13:28:54.795012	migration	migration
4	1	\N	2026-03-16 01:30:00	2026-03-16 09:30:00	2026-03-16 15:39:00.748	2026-03-17 13:28:54.813647	migration	migration
6	1	\N	2026-03-18 08:30:00	2026-03-18 16:30:00	2026-03-16 22:46:20.374	2026-03-17 13:28:54.825879	migration	migration
8	1	1	2026-03-17 01:30:00	2026-03-17 09:30:00	2026-03-17 12:13:40.528	2026-03-17 13:28:54.837175	migration	migration
9	1	1	2026-03-16 01:30:00	2026-03-16 09:30:00	2026-03-17 14:02:28.853717	2026-03-17 14:02:28.853717	admin	admin
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, password, role, fullname, department, created_at, created_by, updated_at, updated_by) FROM stdin;
1	admin	admin	admin	System Admin	\N	2026-03-16 15:38:29.11023	admin	2026-03-16 15:38:29.11023	\N
2	user1	user1	user	Staff 1	\N	2026-03-16 15:38:35.784908	admin	2026-03-16 15:38:35.784908	\N
\.


--
-- Name: booking_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.booking_status_id_seq', 5, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.bookings_id_seq', 37, true);


--
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.cars_id_seq', 1, false);


--
-- Name: driver_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.driver_type_id_seq', 2, true);


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.drivers_id_seq', 2, true);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.trips_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: booking_status booking_status_code_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_status
    ADD CONSTRAINT booking_status_code_key UNIQUE (code);


--
-- Name: booking_status booking_status_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking_status
    ADD CONSTRAINT booking_status_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- Name: driver_type driver_type_code_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.driver_type
    ADD CONSTRAINT driver_type_code_key UNIQUE (code);


--
-- Name: driver_type driver_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.driver_type
    ADD CONSTRAINT driver_type_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_booking_status_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_booking_status_code ON public.booking_status USING btree (code);


--
-- Name: idx_bookings_car_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_bookings_car_id ON public.bookings USING btree (car_id);


--
-- Name: idx_bookings_start_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_bookings_start_time ON public.bookings USING btree (start_time);


--
-- Name: idx_bookings_user_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_bookings_user_id ON public.bookings USING btree (user_id);


--
-- Name: idx_cars_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cars_is_active ON public.cars USING btree (is_active);


--
-- Name: idx_cars_license_plate; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_cars_license_plate ON public.cars USING btree (license_plate);


--
-- Name: idx_drivers_is_active; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_drivers_is_active ON public.drivers USING btree (is_active);


--
-- Name: idx_drivers_type_code; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_drivers_type_code ON public.drivers USING btree (driver_type_code);


--
-- Name: booking_status update_booking_status_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_booking_status_updated_at BEFORE UPDATE ON public.booking_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings update_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cars update_cars_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: drivers update_drivers_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bookings bookings_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id);


--
-- Name: bookings bookings_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: drivers drivers_driver_type_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_driver_type_code_fkey FOREIGN KEY (driver_type_code) REFERENCES public.driver_type(code);


--
-- Name: trips trips_car_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE SET NULL;


--
-- Name: trips trips_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

