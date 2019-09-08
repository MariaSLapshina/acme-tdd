const {expect} = require('chai')
const db = require("./db")
const supertest = require('supertest')
const app = supertest(require("./app"))


describe('TDD', ()=> {
    let seed;
    beforeEach(async() => seed = await db.setup())
    describe('Test Department model', ()=> {
        it('can create a model', () => {
            expect(seed.departments.length).to.not.equal(0)
        })
        it('has a name property', () => {
            expect(db.models.Department.build({name:'Haoyu'}).name).to.equal('Haoyu')
        })
    })
    describe('Test User model', ()=> {
        it('can create a model', () => {
            expect(seed.users.length).to.not.equal(0)
        })
        it('has a name property', () => {
            expect(db.models.User.build({name:'Jesen'}).name).to.equal('Jesen')
        })
        it('has an id', async() => {
            const user2 = await seed.users.name2
            //console.log(seedUsers)
            expect(user2.departmentId).to.be.ok
        })
    })
    describe('API',()=> {
        it('returns users',()=> {
            return app.get('/api/users')
            .expect(200)
            .then(response => {
                expect(response.body.length).to.not.equal(0)
            })
        })
        it('creates a user', ()=> {
            return app.post('/api/users')
            .send({name:'Maria'})
            .expect(201)
            .then(response => {
                expect(response.body.name).to.equal('Maria')
            })
        })
        it('updates a user',() => {
            //console.log(seed.users)
            return app.put(`/api/users/${seed.users.name1.id}`)
            .send({name:'JLH'})
            .expect(200)
            .then(response => {
                expect(response.body.name).to.equal('JLH')
            })
        })
        it('deletes a user', () => {
            return app.delete(`/api/users/${seed.users.name1.id}`)
            .expect(204)
        })
    })
})