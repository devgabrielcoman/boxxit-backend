
//
// declare promises
declare var Promise: any;

//
// task interface
export interface Task <Input, Output> {
	execute(input: Input): Promise<Output>
}
