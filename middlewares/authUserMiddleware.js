import jwt from 'jsonwebtoken';

const authUserMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Faça Login' });
        }

        // Decodifica o token e extrai o id do usuário
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona o id do usuário ao request para uso posterior
        req.userId = decodedToken.id;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: 'Token Expirado. Faça Login Novamente' });
        } else {
            console.log(error);
            res.status(401).json({ error: 'Autenticação Falhou' });
        }
    }
}

export default authUserMiddleware;