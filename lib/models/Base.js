import Sequelize from 'sequelize';
import X         from 'chista/Exception';

class Base extends Sequelize.Model {
    static init(sequelize, options = {}) {
        super.init(this.schema, { ...options, sequelize });
    }

    static initRelationsAndHooks() {
        if (this.initRelations) this.initRelations();
        if (this.initHooks) this.initHooks();
    }

    static async findById(id) {
        const entity = await this.findOne({ where: { id } });

        if (!entity) {
            throw new X({
                code   : 'WRONG_ID',
                fields : { id: 'WRONG_ID' }
            });
        }

        return entity;
    }

    static getIncludeMap(includesList) {
        const includeMap = {};

        includesList.forEach(item => {
            if (!this.whiteIncludeList[item]) return;
            if (includeMap[item]) return;

            includeMap[item] = this.whiteIncludeList[item];
        });

        return includeMap;
    }
}

export default Base;
