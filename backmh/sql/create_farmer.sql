
-- DROP TABLE public.farmer;

CREATE TABLE public.farmer
(
    id bigserial NOT NULL,
    name text NOT NULL,
    region text,
    produce text,
    location text,
    notes text,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.farmer
    OWNER to meatdao;