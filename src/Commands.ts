import { Command } from "./Command";
import { SearchLoLPlayer } from "./commands/SearchLoLPlayer";
import {test} from "./commands/test";
import {minecraftCommand} from "./commands/minecraftCommand";
import {apex} from "./commands/apex";

export const Commands: Command[] = [
	SearchLoLPlayer,
	test,
	minecraftCommand,
	apex
];