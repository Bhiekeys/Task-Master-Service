import { Model, Types } from 'mongoose'

class ConstantService {
    static async findModelById<T>(model: Model<T>, id: Types.ObjectId | string): Promise<T | null> {
        return await model.findById(id);
    }
}

export default ConstantService;