"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkImageExists = void 0;
const core = __importStar(require("@actions/core"));
const got_1 = __importDefault(require("got"));
const PAGE_SIZE = 100;
const checkImageExists = (repository, username, password, image_name, version) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    let found = false;
    try {
        const paginated_answer = got_1.default.paginate(`https://${repository}/v2/${image_name}/tags/list?n=${PAGE_SIZE}`, {
            username,
            password,
            pagination: {
                transform: (response) => {
                    const { tags } = JSON.parse(response.body);
                    return tags;
                },
                shouldContinue: () => !found,
            },
        });
        try {
            for (var paginated_answer_1 = __asyncValues(paginated_answer), paginated_answer_1_1; paginated_answer_1_1 = yield paginated_answer_1.next(), !paginated_answer_1_1.done;) {
                const tag = paginated_answer_1_1.value;
                if (tag === version) {
                    found = true;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (paginated_answer_1_1 && !paginated_answer_1_1.done && (_a = paginated_answer_1.return)) yield _a.call(paginated_answer_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (error) {
        console.error(error);
        return false;
    }
    return found;
});
exports.checkImageExists = checkImageExists;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repository = core.getInput('repository');
            const username = core.getInput('username');
            const password = core.getInput('password');
            const image_name = core.getInput('image_name');
            const version = core.getInput('version');
            core.setOutput('exists', false);
            if (!repository) {
                core.setFailed('repository is required');
                return;
            }
            if (!username) {
                core.setFailed('username is required');
                return;
            }
            if (!password) {
                core.setFailed('password is required');
                return;
            }
            if (!image_name) {
                core.setFailed('image_name is required');
                return;
            }
            if (!version) {
                core.setFailed('version is required');
                return;
            }
            const exists = yield (0, exports.checkImageExists)(repository, username, password, image_name, version);
            core.setOutput('exists', exists);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
