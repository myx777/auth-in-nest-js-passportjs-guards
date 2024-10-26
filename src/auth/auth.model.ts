import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/models/user.schema";


@Module({
    imports: [MongooseModule.forFeature([{
        schema: UserSchema,
        name: User.name,
    }])],
})

export class AuthModule {}