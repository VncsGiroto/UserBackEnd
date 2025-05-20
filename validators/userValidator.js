import vine, { SimpleMessagesProvider } from "@vinejs/vine";

const messages = {
    string: 'O campo {{ field }} deve ser uma string',
    email: 'O campo {{ field }} deve ser um endereço de e-mail válido',
    minLength: 'O campo {{ field }} deve ter pelo menos {{ min }} caracteres',
    maxLength: 'O campo {{ field }} não deve ter mais que {{ max }} caracteres',
    required: 'O campo {{ field }} é obrigatório',
    regex: 'O campo {{ field }} está em um formato inválido',
    date: 'O campo {{ field }} deve ser uma data válida',
    boolean: 'O campo {{ field }} deve ser verdadeiro ou falso',
    unique: 'O campo {{ field }} deve ser único'
};
vine.messagesProvider = new SimpleMessagesProvider(messages);

export const checkInputValues = vine.compile(
    vine.object({
        email: vine.string().email().minLength(5).maxLength(100),
        nome: vine.string().minLength(2).maxLength(60),
        senha: vine.string().minLength(6).maxLength(30),
        cpf: vine.string()
            .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
            .minLength(14)
            .maxLength(14),
        dataNascimento: vine.date(),
    }),
);