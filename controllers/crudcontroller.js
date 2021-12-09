const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');


class CrudController {
    constructor(model) {
        this.model = model;
    }

    update = async (req, res, next) => {
        const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(doc);
    }

    delete = async (req, res, next) => {
        const id = req.params.id;
        const entity = await this.model.findById(id);
        if (entity) {
            const value = entity;
            await entity.delete();
            res.status(204).send(value);
        } else {
            res.status(400).send({ error: 'entity not found' })
        }
    }

    getAll = async (req, res, next) => {
        const entities = await this.model.find();
        res.send(entities);
    }

    getById = async (req, res, next) => {
        const entity = await this.model.findById({ _id: req.params.id });
        res.send(entity);
    }

}


module.exports = CrudController;