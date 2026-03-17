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
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
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
    requester_name character varying(255),
    requester_position character varying(255),
    car_id integer,
    supervisor_name character varying(255),
    supervisor_position character varying(255),
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    destination character varying(255) NOT NULL,
    purpose text,
    distance numeric(10,2),
    passengers integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    trip_id integer,
    driver_id integer,
    department_id integer,
    trip_type_id integer,
    fuel_reimbursement_id integer,
    status_id integer
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
-- Name: car_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.car_type (
    id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.car_type OWNER TO admin;

--
-- Name: car_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.car_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.car_type_id_seq OWNER TO admin;

--
-- Name: car_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.car_type_id_seq OWNED BY public.car_type.id;


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
    car_number character varying(50),
    car_type_id integer
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
-- Name: department; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.department (
    id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.department OWNER TO admin;

--
-- Name: department_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_id_seq OWNER TO admin;

--
-- Name: department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.department_id_seq OWNED BY public.department.id;


--
-- Name: driver_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.driver_type (
    id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
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
    driver_type_id integer
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
-- Name: fuel_reimbursement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.fuel_reimbursement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_reimbursement_id_seq OWNER TO admin;

--
-- Name: fuel_reimbursement; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.fuel_reimbursement (
    id integer DEFAULT nextval('public.fuel_reimbursement_id_seq'::regclass) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.fuel_reimbursement OWNER TO admin;

--
-- Name: trip_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.trip_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_type_id_seq OWNER TO admin;

--
-- Name: trip_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.trip_type (
    id integer DEFAULT nextval('public.trip_type_id_seq'::regclass) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.trip_type OWNER TO admin;

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
-- Name: user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_role_id_seq OWNER TO admin;

--
-- Name: user_role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_role (
    id integer DEFAULT nextval('public.user_role_id_seq'::regclass) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.user_role OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    fullname character varying(150),
    department character varying(150),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by character varying(100),
    role_id integer
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
-- Name: car_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.car_type ALTER COLUMN id SET DEFAULT nextval('public.car_type_id_seq'::regclass);


--
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- Name: department id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.department ALTER COLUMN id SET DEFAULT nextval('public.department_id_seq'::regclass);


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

COPY public.booking_status (id, is_active, name) FROM stdin;
1	t	รอจัดรถ
2	t	จัดรถแล้ว
4	t	เสร็จสิ้น
5	t	ยกเลิก
3	t	ไม่อนุมัติ
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.bookings (id, requester_name, requester_position, car_id, supervisor_name, supervisor_position, start_time, end_time, destination, purpose, distance, passengers, created_at, updated_at, trip_id, driver_id, department_id, trip_type_id, fuel_reimbursement_id, status_id) FROM stdin;
\.


--
-- Data for Name: car_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.car_type (id, is_active, name) FROM stdin;
3	t	รถยนต์นั่งบรรทุก4ประตู
1	t	รถตู้นั่งบรรทุก
2	t	รถยนต์บรรทุก
\.


--
-- Data for Name: cars; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cars (id, brand, model, license_plate, seats, car_type, image_url, created_at, created_by, updated_at, updated_by, is_active, car_number, car_type_id) FROM stdin;
1	Toyota	Commuter	นข 1234	12	รถตู้นั่งบรรทุก	\N	2026-03-17 20:08:38.38333	admin	2026-03-17 20:08:38.38333	\N	t	\N	1
2	Honda	CR-V	กท 5678	5	รถยนต์นั่งบรรทุก4ประตู	\N	2026-03-17 20:08:38.393096	admin	2026-03-17 20:08:38.393096	\N	t	\N	3
3	Toyota	Commuter	ฎน 9999	12	รถตู้นั่งบรรทุก	\N	2026-03-17 20:08:38.414686	admin	2026-03-17 20:08:38.414686	\N	t	\N	1
4	Isuzu	D-Max	ธศ 4321	5	รถยนต์บรรทุก	\N	2026-03-17 20:08:38.427866	admin	2026-03-17 20:08:38.427866	\N	t	\N	2
\.


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.department (id, is_active, name) FROM stdin;
1	t	กลุ่มงานพัฒนายุทธศาสตร์
2	t	กลุ่มงานสุขภาพดิจิทัล
3	t	กลุ่มงานประกันสุขภาพ
4	t	กลุ่มงานควบคุมโรคติดต่อ
5	t	กลุ่มงานคุ้มครองผู้บริโภค
6	t	กลุ่มงานส่งเสริมสุขภาพ
7	t	กลุ่มงานทรัพยากรบุคคล
8	t	กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย
9	t	กลุ่มกฎหมาย
10	t	กลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ
\.


--
-- Data for Name: driver_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.driver_type (id, is_active, name) FROM stdin;
1	t	พนักงานขับรถเป็นครั้งคราว
2	t	พนักงานขับรถยนต์
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.drivers (id, fullname, is_active, note, created_at, created_by, updated_at, updated_by, driver_type_id) FROM stdin;
2	คนขับรถ ทดสอบ 2	t	พนักงานขับรถชั่วคราว	2026-03-16 16:07:20.261433	admin	2026-03-17 21:55:32.409068	\N	1
1	คนขับรถ ทดสอบ 1	t	พนักงานขับรถประจำ	2026-03-16 16:07:20.261433	admin	2026-03-17 21:55:32.409068	admin	2
\.


--
-- Data for Name: fuel_reimbursement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.fuel_reimbursement (id, is_active, name) FROM stdin;
1	t	เบิกจากหน่วยงานต้นสังกัด
2	t	เบิกจากหน่วยงานผู้จัด
\.


--
-- Data for Name: trip_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.trip_type (id, is_active, name) FROM stdin;
1	t	ภายในจังหวัด
2	t	ต่างจังหวัด
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.trips (id, car_id, driver_id, start_date_time, end_date_time, created_at, updated_at, created_by, updated_by) FROM stdin;
1	2	1	2026-03-20 08:00:00	2026-03-20 17:00:00	2026-03-17 22:11:37.438479	2026-03-17 22:11:37.438479	admin	admin
2	1	2	2026-03-19 07:00:00	2026-03-19 17:00:00	2026-03-17 22:14:25.112703	2026-03-17 22:14:25.112703	admin	admin
4	4	1	2026-03-18 08:30:00	2026-03-18 15:30:00	2026-03-17 22:47:43.674871	2026-03-17 22:47:43.674871	admin	admin
5	2	1	2026-03-20 08:00:00	2026-03-20 18:00:00	2026-03-17 22:48:47.312683	2026-03-17 22:48:47.312683	admin	admin
6	2	2	2026-03-21 06:30:00	2026-03-21 19:30:00	2026-03-17 23:06:54.924185	2026-03-17 23:06:54.924185	admin	admin
7	2	2	2026-03-22 08:45:00	2026-03-22 18:00:00	2026-03-17 23:07:15.283533	2026-03-17 23:07:15.283533	admin	admin
\.


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_role (id, is_active, name) FROM stdin;
1	t	ผู้ใช้งาน
2	t	ผู้ดูแลระบบ
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, password, fullname, department, created_at, created_by, updated_at, updated_by, role_id) FROM stdin;
1	admin	admin	System Admin	\N	2026-03-16 15:38:29.11023	admin	2026-03-17 21:55:32.413441	\N	2
2	user1	user1	Staff 1	\N	2026-03-16 15:38:35.784908	admin	2026-03-17 21:55:32.413441	\N	1
\.


--
-- Name: booking_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.booking_status_id_seq', 7, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- Name: car_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.car_type_id_seq', 105, true);


--
-- Name: cars_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.cars_id_seq', 5, true);


--
-- Name: department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.department_id_seq', 10, true);


--
-- Name: driver_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.driver_type_id_seq', 2, true);


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.drivers_id_seq', 5, true);


--
-- Name: fuel_reimbursement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.fuel_reimbursement_id_seq', 3, true);


--
-- Name: trip_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.trip_type_id_seq', 3, false);


--
-- Name: trips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.trips_id_seq', 7, true);


--
-- Name: user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_role_id_seq', 3, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


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
-- Name: car_type car_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.car_type
    ADD CONSTRAINT car_type_pkey PRIMARY KEY (id);


--
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);


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
-- Name: fuel_reimbursement fuel_reimbursement_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.fuel_reimbursement
    ADD CONSTRAINT fuel_reimbursement_pkey PRIMARY KEY (id);


--
-- Name: trip_type trip_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.trip_type
    ADD CONSTRAINT trip_type_pkey PRIMARY KEY (id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


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
-- Name: booking_status_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX booking_status_name_key ON public.booking_status USING btree (name);


--
-- Name: car_type_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX car_type_name_key ON public.car_type USING btree (name);


--
-- Name: department_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX department_name_key ON public.department USING btree (name);


--
-- Name: driver_type_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX driver_type_name_key ON public.driver_type USING btree (name);


--
-- Name: fuel_reimbursement_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX fuel_reimbursement_id_key ON public.fuel_reimbursement USING btree (id);


--
-- Name: fuel_reimbursement_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX fuel_reimbursement_name_key ON public.fuel_reimbursement USING btree (name);


--
-- Name: idx_bookings_car_id; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_bookings_car_id ON public.bookings USING btree (car_id);


--
-- Name: idx_bookings_start_time; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_bookings_start_time ON public.bookings USING btree (start_time);


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
-- Name: trip_type_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX trip_type_id_key ON public.trip_type USING btree (id);


--
-- Name: trip_type_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX trip_type_name_key ON public.trip_type USING btree (name);


--
-- Name: user_role_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX user_role_id_key ON public.user_role USING btree (id);


--
-- Name: user_role_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX user_role_name_key ON public.user_role USING btree (name);


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
-- Name: bookings bookings_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(id);


--
-- Name: bookings bookings_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_fuel_reimbursement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_fuel_reimbursement_id_fkey FOREIGN KEY (fuel_reimbursement_id) REFERENCES public.fuel_reimbursement(id);


--
-- Name: bookings bookings_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.booking_status(id);


--
-- Name: bookings bookings_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_trip_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_trip_type_id_fkey FOREIGN KEY (trip_type_id) REFERENCES public.trip_type(id);


--
-- Name: cars cars_car_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_car_type_id_fkey FOREIGN KEY (car_type_id) REFERENCES public.car_type(id) ON DELETE SET NULL;


--
-- Name: drivers drivers_driver_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_driver_type_id_fkey FOREIGN KEY (driver_type_id) REFERENCES public.driver_type(id);


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
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_role(id);


--
-- PostgreSQL database dump complete
--

