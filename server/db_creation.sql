CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_donation_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NULL,
    email VARCHAR(150) NULL,
    recurrent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_id INTEGER REFERENCES subscriptions(id)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status VARCHAR(50),
    subscription_id INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE message_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    content TEXT,
    recurrent BOOLEAN,
    type VARCHAR(100) NOT NULL
);
