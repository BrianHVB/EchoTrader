--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

-- Started on 2018-02-24 16:22:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 198 (class 1259 OID 16404)
-- Name: gdax_basic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE gdax_basic (
    id bigint NOT NULL,
    "time" timestamp without time zone,
    exchange character varying(4),
    currency character varying(3),
    base_currency character varying(3),
    last_trade_time timestamp without time zone,
    last_trade_price numeric(28,10),
    last_trade_volume numeric(28,10),
    high numeric(28,10),
    low numeric(28,10),
    average numeric(28,10),
    total_volume numeric(28,10),
    average_volume numeric(28,10),
    last_trade_id bigint,
    last_trade_side character varying(20)
);


ALTER TABLE gdax_basic OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 16407)
-- Name: gdax_basic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE gdax_basic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gdax_basic_id_seq OWNER TO postgres;

--
-- TOC entry 2814 (class 0 OID 0)
-- Dependencies: 199
-- Name: gdax_basic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE gdax_basic_id_seq OWNED BY gdax_basic.id;


--
-- TOC entry 2680 (class 2604 OID 16409)
-- Name: gdax_basic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gdax_basic ALTER COLUMN id SET DEFAULT nextval('gdax_basic_id_seq'::regclass);


--
-- TOC entry 2807 (class 0 OID 16404)
-- Dependencies: 198
-- Data for Name: gdax_basic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY gdax_basic (id, "time", exchange, currency, base_currency, last_trade_time, last_trade_price, last_trade_volume, high, low, average, total_volume, average_volume, last_trade_id, last_trade_side) FROM stdin;
\.


--
-- TOC entry 2816 (class 0 OID 0)
-- Dependencies: 199
-- Name: gdax_basic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('gdax_basic_id_seq', 1, true);


--
-- TOC entry 2682 (class 2606 OID 16415)
-- Name: gdax_basic gdax_basic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gdax_basic
    ADD CONSTRAINT gdax_basic_pkey PRIMARY KEY (id);


--
-- TOC entry 2683 (class 2606 OID 16416)
-- Name: gdax_basic gdax_basic_base_currency_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gdax_basic
    ADD CONSTRAINT gdax_basic_base_currency_fkey FOREIGN KEY (base_currency) REFERENCES currencies(symbol);


--
-- TOC entry 2684 (class 2606 OID 16421)
-- Name: gdax_basic gdax_basic_currency_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gdax_basic
    ADD CONSTRAINT gdax_basic_currency_fkey FOREIGN KEY (currency) REFERENCES currencies(symbol);


--
-- TOC entry 2685 (class 2606 OID 16426)
-- Name: gdax_basic gdax_basic_exchange_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY gdax_basic
    ADD CONSTRAINT gdax_basic_exchange_fkey FOREIGN KEY (exchange) REFERENCES exchanges(symbol);


--
-- TOC entry 2813 (class 0 OID 0)
-- Dependencies: 198
-- Name: gdax_basic; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE ON TABLE gdax_basic TO et_data_interface;


--
-- TOC entry 2815 (class 0 OID 0)
-- Dependencies: 199
-- Name: gdax_basic_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE gdax_basic_id_seq TO et_data_interface;


-- Completed on 2018-02-24 16:22:03

--
-- PostgreSQL database dump complete
--

