"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.details = void 0;
var cliUtils_1 = require("../../../../FlowHelpers/1.0.0/cliUtils");
var fileUtils_1 = require("../../../../FlowHelpers/1.0.0/fileUtils");

/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
var details = function () {
    return {
    name: 'Convert Flac or aac 7',
        description: "Check if a audio stream is Flac or aac 7 and convert it to opus\nMake sure the streams are in the correct order before running this plugin",
        style: {
            borderColor: 'green',
        },
        tags: 'audio',
        isStartPlugin: false,
        pType: '',
        requiresVersion: '2.11.01',
        sidebarPosition: -1,
        icon: '',
        inputs: [],
        outputs: [
            {
                number: 1,
                tooltip: 'File has flac and converted to opus',
            },
            {
                number: 2,
                tooltip: 'File has aac 7 and converted to opus',
            },
            {
                number: 3,
                tooltip: 'File does not have flac or aac 7',
            },
        ],
    }
};

exports.details = details;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
var plugin = function (args) {
  return __awaiter(void 0, void 0, void 0, function () {
    var audioIndex, hasFlac, hasAAC, stream, container, lib, outputFilePath, cliArgs, spawnArgs, cli, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lib = require('../../../../../methods/lib')();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-param-reassign
                args.inputs = lib.loadDefaultValues(args.inputs, details);
                hasFlac = false;
                hasAAC = false;
                container = (0, fileUtils_1.getContainer)(args.inputFileObj._id);
                outputFilePath = "".concat((0, fileUtils_1.getPluginWorkDir)(args), "/").concat((0, fileUtils_1.getFileName)(args.inputFileObj._id), ".").concat(container);
                //var spawnArgs = [];
                spawnArgs = ["-y", "-i", args.inputFileObj.file,"-map", "0", "-c", "copy"];
                // Go through each stream in the file starting at the first audio stream
                for (var i = 1; i < args.inputFileObj.ffProbeData.streams.length; i += 1) {
                // Check if stream is audio and flac.
                    stream = args.inputFileObj.ffProbeData.streams[i];
                    audioIndex = i-1;
                    if (stream.codec_type.toLowerCase() === "audio" && stream.codec_name.toLowerCase() === "flac") {
                      hasFlac = true;
                      spawnArgs.push("".concat("-c:a:",audioIndex),"libopus","-ac");
                      //"-c:a:" + i + "libopus" + "-ac";
                          switch (stream.channels){
                            case 2:
                              spawnArgs.push("2","-b:a","192K");
                              //ffmpegCommandInsert += "-ac 2 -b:a 192K";
                              break;
                            case 6:
                              spawnArgs.push("6","-b:a","256K");
                              //spawnArgs += "6" + "-b:a" + "256K";
                              //ffmpegCommandInsert += "-ac 6 -b:a 256K";
                              break;outputNumber
                            case 8:
                              spawnArgs.push("8","-b:a","384K");
                              //spawnArgs += "8" + "-b:a" + "384K";
                              //ffmpegCommandInsert += "-ac 8 -b:a 384K";
                              break;
                          }
                    } else if (stream.codec_type.toLowerCase() === "audio" && stream.codec_name.toLowerCase() === "aac" && stream.channels === 8){
                      hasAAC = true;
                      spawnArgs.push("".concat("-c:a:",audioIndex),"libopus","-ac","8","-b:a","384K","-map","".concat("0:a:",audioIndex));
                    }
                }
                spawnArgs.push(outputFilePath);
                if (hasAAC || hasFlac){
                  cli = new cliUtils_1.CLI({
                    cli: "/usr/local/bin/ffmpeg",
                    spawnArgs: spawnArgs,
                    spawnOpts: {},
                    jobLog: args.jobLog,
                    outputFilePath: outputFilePath,
                    inputFileObj: args.inputFileObj,
                    logFullCliOutput: args.logFullCliOutput,
                    updateWorker: args.updateWorker,
                    });
                  return [4 /*yield*/, cli.runCli()];
                }
            case 1:
              if (hasAAC || hasFlac){
                res = _a.sent();
                if (res.cliExitCode !== 0) {
                  args.jobLog('Running FFmpeg failed');
                  throw new Error('FFmpeg failed');
                }
              }
              return [2 /*return*/, {
                  outputFileObj: hasFlac ? { _id: outputFilePath } : hasAAC ? { _id: outputFilePath } : args.inputFileObj,
                  outputNumber: hasFlac ? 1 : hasAAC ? 2 : 3,
                  variables: args.variables,
              }];
        }
    });
  });
};
exports.plugin = plugin;
