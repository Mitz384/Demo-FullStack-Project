DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tạo bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255),
    user_status VARCHAR(50) DEFAULT 'offline'
);

-- Tạo bảng products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(255)
);

INSERT INTO users (first_name, last_name, email, password) VALUES
( 'Nguyen', 'Anh', 'nguyenanh123@gmail.com', '$2b$10$zJLHGDWnGn4eEt8RpFrlV.Y1rBJzNkwP6j8D4hPyaSKMru9tuVJ4K' ),
( 'Doan', 'Son', 'dnson384@gmail.com', NULL ),
( 'Doan', 'Nhu', 'doannhuson2004@gmail.com', '$2b$10$6e8dgGxUVkPJLX4qDMOBFencxhSJ9HBK.Aq1d//Yw6GI3PmWGFLZO' );


INSERT INTO products (name, description, price, category, stock) VALUES
( 'Áo thun nam cotton', 'Áo thun chất cotton thoáng mát, co giãn tốt', 199000, 50, '/images/ao-thun-nam.jpg' ),
( 'Quần jean nữ', 'Quần jean lưng cao thời trang, tôn dáng', 349000, 30, '/images/quan-jean-nu.jpg' );
