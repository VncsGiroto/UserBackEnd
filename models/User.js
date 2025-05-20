import { DataTypes } from "sequelize";
import { userDB } from '../db/db.js'

const User = userDB.define('User', {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    nome: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/ // Exemplo: 000.000.000-00
        }
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default User;