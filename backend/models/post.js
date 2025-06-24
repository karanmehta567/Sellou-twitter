import Joi from "joi";
const Schema = Joi.object({
    text: Joi.string().min(1).required(),
    image: Joi.string().uri().optional()
})
export function ValidatePost(body) {
    const { error, value } = Schema.validate(body)
    return {
        valid: !error,
        error: error ? error.details[0].message : null,
        value
    }
}
