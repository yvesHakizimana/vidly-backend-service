const request = require('supertest');
const {Genre} = require('../../models/genre')
const {User} = require('../../models/user');
const mongoose = require("mongoose");

let server;

describe('/api/genres', () => {

    beforeEach(async () => {
        server = require('../../index');
        await Genre.collection.insertMany([
            {name: 'genre1'}, {name : 'genre2'}, {name: 'genre3'}
        ])
    })

    afterEach(async () => {
        server.close();
        await Genre.deleteMany({})
    })


    describe('GET /', () => {
        it('should return all genres', async () => {
            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy()

        });
    })

    describe('GET /:id', () => {
        it('should return the genre if valid id is passed', async () => {
            const genre = new Genre({name: 'genre1'})
            await genre.save()

            const res = await request(server).get(`/api/genres/${genre._id}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id', genre._id.toHexString())
            expect(res.body).toHaveProperty('name', genre.name)
        })

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1')

            expect(res.status).toBe(404)
        })

        it('should return 404 if the genre is not found having valid genreId', async () => {
            const res = await request(server).get(`/api/genres/${new mongoose.Types.ObjectId()}`)

            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {

        let token;
        let name;

        const exec =  async function(){
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name})
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1'
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec()

            expect(res.status).toBe(401)
        });

        it('should return 400 if genre is less than 5 characters.', async () => {
            name = '1234'
            const res = await exec()

            expect(res.status).toBe(400)
        });

        it('should return 400 if genre is more than 5 characters.', async () => {
            token = new User().generateAuthToken();
            name  = new Array(52).join('a')
            const res = await exec()

            expect(res.status).toBe(400)
        });

        it('should save the genre if the input is valid', async () => {
           token = new User().generateAuthToken();

            const res = await exec();

            const genre = await Genre.find({ name: 'genre1'})

            expect(res.status).toBe(200)
            expect(genre).not.toBeNull()
        });

        it('should return the genre if the input is valid', async () => {
            const token = new User().generateAuthToken();

            const res = await exec()

            const genre = await Genre.find({ name: 'genre1'})

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', 'genre1')
        });
    })









})