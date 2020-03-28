export default function dumpEntity(entity) {
    return {
        ...entity.dataValues,
        createdAt : entity.dataValues.createdAt.toISOString(),
        updatedAt : entity.dataValues.createdAt.toISOString()
    };
}
