const Joi = require("joi");
const { DbErrors } = require("objection-db-errors");
const { Model } = require("objection");
const knex = require("../../config/dbConfig");
const _ = require("underscore");
Model.knex(knex);

exports.Model = class extends DbErrors(Model) {
  static createNotFoundError(ctx) {
    const error = super.createNotFoundError(ctx);

    return Object.assign(error, {
      modelName: this.name,
    });
  }

  static field(name) {
    return Joi.reach(this.getJoiSchema(), name)
      .optional()
      .options({ noDefaults: true });
  }

  static fields() {
    return _.keys(this.getJoiSchema().describe().children);
  }
};
