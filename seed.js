const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
    {
        name: 'Premium Wireless Headphones',
        category: 'Electronics',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        stock: 50,
        description: 'High-quality wireless headphones with noise cancellation.'
    },
    {
        name: 'Smart Watch Series 7',
        category: 'Electronics',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        stock: 30,
        description: 'Stay connected with the latest smart watch technology.'
    },
    {
        name: 'Classic Leather Backpack',
        category: 'Fashion',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        stock: 100,
        description: 'Durable and stylish leather backpack for everyday use.'
    },
    {
        name: 'Professional DSLR Camera',
        category: 'Electronics',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
        stock: 15,
        description: 'Capture stunning photos with this professional-grade camera.'
    },
    {
        name: 'Organic Green Tea',
        category: 'Groceries',
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1544787210-22c66ae96084?w=500&q=80',
        stock: 200,
        description: 'Fresh organic green tea leaves for a healthy lifestyle.'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB Connected for seeding...');

        // Create initial admin if none exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'adminpassword123',
                role: 'admin'
            });
            console.log('Admin account created: admin@example.com / adminpassword123');
        }

        // Only seed if no products exist
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(products);
            console.log('Database Seeded with initial products!');
        } else {
            console.log('Database already has products, skipping product seed.');
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
