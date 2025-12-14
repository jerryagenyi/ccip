-- PostgreSQL schema based on the application's data models.
-- This schema is a starting point for migrating from Firestore to a self-hosted PostgreSQL database.

-- User Profiles Table
CREATE TABLE UserProfile (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatarId VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    team VARCHAR(255)
);

-- Activity Table
-- Using a text-based ENUM for status for readability.
CREATE TYPE activity_status AS ENUM ('Draft', 'Submitted', 'Approved', 'Rejected', 'Completed');

CREATE TABLE Activity (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status activity_status NOT NULL,
    organization VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    dateCreated TIMESTAMP WITH TIME ZONE NOT NULL,
    lastModified TIMESTAMP WITH TIME ZONE,
    description TEXT,
    type VARCHAR(255)
);

-- Organisation Table
CREATE TYPE organisation_level AS ENUM ('Federal', 'State', 'LGA');
CREATE TYPE organisation_type AS ENUM ('Government', 'NGO', 'CSO', 'LGA');
CREATE TYPE organisation_status AS ENUM ('Active', 'Pending', 'Suspended');

CREATE TABLE Organisation (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level organisation_level NOT NULL,
    type organisation_type NOT NULL,
    members INTEGER,
    activities INTEGER,
    status organisation_status NOT NULL,
    parent_id VARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES Organisation(id)
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_user_email ON UserProfile(email);
CREATE INDEX idx_activity_status ON Activity(status);
CREATE INDEX idx_activity_organization ON Activity(organization);
CREATE INDEX idx_organisation_level ON Organisation(level);
