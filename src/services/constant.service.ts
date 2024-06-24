import { Model, Types } from 'mongoose'

class ConstantService {
    static async findModelById<T>(model: Model<T>, id: Types.ObjectId | string): Promise<T | null> {
        return await model.findById(id);
    }

    static async findModelByOne<T>(model: Model<T>, filter: Object): Promise<T | null> {
        return await model.findOne(filter);
    }
}

export default ConstantService;