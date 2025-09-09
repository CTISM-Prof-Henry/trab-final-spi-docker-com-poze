import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { UserDTO } from "../core/dtos/user.dto";

@Controller('users')
export class UserController {

    constructor (private userService: UserService) {}

    @Get('findAll')
    findAll() {
        return this.userService.getUsers();
    }

    @Post()
    create(@Body() body: UserDTO) {
        return this.userService.create(body);
    }
}