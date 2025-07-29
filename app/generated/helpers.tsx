import { Role } from './prisma/client'

const privilegeRoles: Role[] = [Role.EDITOR, Role.MODERADOR, Role.ADMIN]
const managerRoles: Role[] = [Role.MODERADOR, Role.ADMIN]
// const adminRole: Role[] = [Role.ADMIN]

export default privilegeRoles
