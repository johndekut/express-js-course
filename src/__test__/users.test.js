import * as validator from "express-validator";
import * as helpers from "../Utils/helpers.mjs";
import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { User } from "../mongoose/schemas/userSchema.mjs";

jest.mock("express-validator", () => ({
	validationResult: jest.fn(() => ({
    //isEmpty returns false thus valifation fails
		isEmpty: jest.fn(() => false),
		array: jest.fn(() => [{ msg: "Invalid Field" }]),
	})),
	matchedData: jest.fn(() => ({
		username: "test",
		password: "password",
		displayName: "test_name",
	})),
}));

jest.mock("../Utils/helpers.mjs", () => ({
  //mocks helper that hases password
	hashPassword: jest.fn((password) => `hashed_${password}`),
}));
//mocking the whole db model
jest.mock("../mongoose/schemas/userSchema.mjs");


//mocking the request and response
const mockRequest = {
	params:{
    id: 2
  }
};

const mockResponse = {
	sendStatus: jest.fn(),
	send: jest.fn(),
	status: jest.fn(() => mockResponse),
};
//first test suit to test whether we got the user
describe("get users", () => {
	it("should get user by id", () => {
		getUserByIdHandler(mockRequest, mockResponse);
		expect(mockResponse.send).toHaveBeenCalled();
		expect(mockResponse.send).toHaveBeenCalledWith({
			id: 2,
			userName: "James",
			displayName: "Makomele",
			password: "hello124",
		});
		expect(mockResponse.send).toHaveBeenCalledTimes(1);
	});

	it("should call sendStatus with 400 when user not found", () => {
		const copyMockRequest = { ...mockRequest, params:{id:100} };
		getUserByIdHandler(copyMockRequest, mockResponse);
		expect(mockResponse.sendStatus).toHaveBeenCalled();
		expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
		expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
		expect(mockResponse.send).not.toHaveBeenCalled();
	});
});

describe("create users", () => {
	const mockRequest = {};
	it("should return status of 400 when there are errors", async () => {
		await createUserHandler(mockRequest, mockResponse);
    //tests when validation fails since that is what is set to default globally
		expect(validator.validationResult).toHaveBeenCalled();
		expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
	});

	it("should return status of 201 and the user created", async () => {
    //make it behave differently since the default is failed validation but this is supposed to pass - use mockImplementationOnce
		jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      //make isEmpty to true so validation passes
			isEmpty: jest.fn(() => true),
		}));

		const saveMethod = jest
			.spyOn(User.prototype, "save") //spying on save() method for the userSchema model

      //change the value to be returned only once in this function
			.mockResolvedValueOnce({
				id: 1,
				username: "test",
				password: "hashed_password",
				displayName: "test_name",
			});
		await createUserHandler(mockRequest, mockResponse);
		expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
		expect(helpers.hashPassword).toHaveBeenCalledWith("password");
		expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
		expect(User).toHaveBeenCalledWith({
			username: "test",
			password: "hashed_password",
			displayName: "test_name",
		});

		expect(saveMethod).toHaveBeenCalled();
		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.send).toHaveBeenCalledWith({
			id: 1,
			username: "test",
			password: "hashed_password",
			displayName: "test_name",
		});
	});
  //test db failing
	it("send status of 400 when database fails to save user", async () => {
    //modify validationResult so that there's no error
		jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));
		const saveMethod = jest
			.spyOn(User.prototype, "save")
      //set .save() method to fail
			.mockImplementationOnce(() => Promise.reject("Failed to save user"));
		await createUserHandler(mockRequest, mockResponse);
		expect(saveMethod).toHaveBeenCalled();
		expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
	});
});