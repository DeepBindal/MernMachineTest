import jwt from 'jsonwebtoken'

export const signJwt = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET)
}