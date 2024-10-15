import bcrypt from 'bcrypt';

// Función para encriptar la contraseña
const encryptPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Función para generar usuarios ficticios
export const generateMockUsers = (num) => {
    const users = [];
    for (let i = 0; i < num; i++) {
        const role = i % 2 === 0 ? 'user' : 'admin';
        const password = 'coder123';
        const encryptedPassword = bcrypt.hashSync(password, 10);
        users.push({
            name: `User${i}`,
            email: `user${i}@mock.com`,
            password: encryptedPassword,
            role: role,
            pets: []
        });
    }
    return users;
};

// Función para generar mascotas ficticias
export const generateMockPets = (num) => {
    const pets = [];
    const petTypes = ['dog', 'cat', 'rabbit', 'hamster'];
    const petNames = ['Fluffy', 'Spot', 'Max', 'Luna', 'Charlie', 'Bella'];

    for (let i = 0; i < num; i++) {
        const randomType = petTypes[Math.floor(Math.random() * petTypes.length)];
        const randomName = petNames[Math.floor(Math.random() * petNames.length)];

        pets.push({
            name: `${randomName} ${i}`,
            type: randomType,
            age: Math.floor(Math.random() * 15) + 1
        });
    }

    return pets;
};
