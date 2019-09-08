const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd',{logging:false})
const { STRING, UUID, UUIDV4 } = Sequelize

const validator = {
    id: {
        primaryKey: true,
        type: UUID,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}

const hooksObj = {
  hooks: {
    async beforeSave(user) {
      if (!user.departmentId) return

      const users = await User.findAll({ where: { departmentId: user.departmentId } })
      if (users.length >= 5) throw new Error("Can't have more than 5 users")
    }
  }
}

const Department = conn.define('department', validator)
const User = conn.define('user',{
    ...validator,
    departmentId:{
        type: UUID
    }
}, hooksObj)

Department.hasMany(User)
User.belongsTo(Department)

const setup = async() => {
    await conn.sync({ force: true})
    const departments = [await Department.create({name:'HR'})]
    const users =[
        {name:'Jesen',
    departmentId:departments[0].id},
    {name:'Prof',
    departmentId:departments[0].id},
    {name:'Haoyu',
    departmentId:departments[0].id}
    ]
    const [name1, name2, name3] = await Promise.all(users.map(user =>User.create(user) ))
    return {departments, users: {name1, name2, name3}}
}

module.exports = {
    setup,
    models: {
        Department, User
    },
    conn
}
