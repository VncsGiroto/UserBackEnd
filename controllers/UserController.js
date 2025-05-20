import { User } from "../models/index.js";
import { checkInputValues } from "../validators/userValidator.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

class UserController {
    static async getAll(req, res) {
        try {
            const users = await User.findAll();
            res.status(200)
                .json(users);
        } catch (error) {
            res.status(500)
                .json({ messages: 'Erro inesperado' });
        }
    }
    static async create(req, res) {
        try {
            const { email, nome, senha, cpf, dataNascimento } = req.body;

            // Validação dos dados de entrada
            await checkInputValues.validate(req.body);

            // Verifica se já existe usuário com o mesmo e-mail
            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(401).json({ messages: 'Email já cadastrado' });
            }

            // Verifica se já existe usuário com o mesmo CPF
            const existingCpf = await User.findOne({ where: { cpf } });
            if (existingCpf) {
                return res.status(401).json({ messages: 'CPF já cadastrado' });
            }

            // Hash da senha
            const hashPassword = await bcrypt.hash(senha, 12);

            // Criação do usuário
            const newUser = await User.create({
                email,
                nome,
                senha: hashPassword,
                cpf,
                dataNascimento,
            });

            return res.status(201).json({
                messages: 'Usuário criado com sucesso'
            });

        } catch (error) {
            if (error.messages) {
                res.status(400).json({ messages: error.messages });
            } else {
                res.status(400).json({ messages: 'Erro inesperado' });
                console.log(error);
            }
        }
    }
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            const IsUser = await User.findOne({where: {email},});

            if(!IsUser){
                res.status(400)
                    .json({messages: 'Email Incorreto'});
                return;
            }

            const IsCorrectPassword = await bcrypt.compare(senha, IsUser.senha);

            if(!IsCorrectPassword){
                res.status(400)
                .json({messages: 'Senha Incorreta'});
                return;
            }

            const token = jwt.sign({id: IsUser.id}, process.env.JWT_SECRET);

            res.status(200)
                .json({
                    messages: 'Usuário Logado',
                    token
                });
        } catch (error) {
            res.status(500)
                .json({ messages: 'Erro inesperado' });
            console.log(error)
        }
    }
    static async checkToken(req, res) {
        try {
            const user = await User.findByPk(req.userId);
            if (!user) {
                return res.status(404).json({ messages: 'Usuário não encontrado' });
            }
            res.status(200)
                .json({
                    messages: 'Token Válido',
                });
        } catch (error) {
            res.status(500)
                .json({ messages: 'Erro inesperado' });
            console.log(error)
        }
    }
    static async getById(req, res) {
        try {
            const user = await User.findByPk(req.userId, {
                attributes: { exclude: ['senha'] }
            });

            if (!user) {
                return res.status(404).json({ messages: 'Usuário não encontrado' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ messages: 'Erro inesperado' });
            console.log(error);
        }
    }
}

export default UserController;