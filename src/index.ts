/**
 * This is the ProtoC compiler plugin.
 *
 * It only accepts stdin/stdout output according to the protocol
 * specified in [plugin.proto](https://github.com/google/protobuf/blob/master/src/google/protobuf/compiler/plugin.proto).
 */
import { ExportMap } from './lib/ExportMap';
import { ProtoIndexFormatter } from './lib/format/ProtoIndexFormatter';
import { ProtoMsgInterfaceFormatter } from './lib/format/ProtoMsgInterfaceFormatter';
import { Utility } from './lib/Utility';
import {
  CodeGeneratorRequest,
  CodeGeneratorResponse,
} from 'google-protobuf/google/protobuf/compiler/plugin_pb';
import { FileDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb';

import { ProtoMsgTsdFormatter } from './lib/format/ProtoMsgTsdFormatter';
import { ProtoSvcTsdFormatter } from './lib/format/ProtoSvcTsdFormatter';
import { TplEngine } from './lib/TplEngine';

Utility.withAllStdIn((inputBuff: Buffer) => {
  try {
    let typedInputBuff = new Uint8Array((inputBuff as any).length);
    //noinspection TypeScriptValidateTypes
    typedInputBuff.set(inputBuff);

    let codeGenRequest = CodeGeneratorRequest.deserializeBinary(typedInputBuff);
    let codeGenResponse = new CodeGeneratorResponse();
    let exportMap = new ExportMap();
    let fileNameToDescriptor: { [key: string]: FileDescriptorProto } = {};

    codeGenRequest.getProtoFileList().forEach(protoFileDescriptor => {
      fileNameToDescriptor[protoFileDescriptor.getName()] = protoFileDescriptor;
      exportMap.addFileDescriptor(protoFileDescriptor);
    });

    const interfaces = [];
    const files = codeGenRequest.getFileToGenerateList().reduce((fileList, fileName) => {
      // message part
      let msgFileName = Utility.filePathFromProtoWithoutExt(fileName);
      fileList.push(msgFileName);

      const msgInterfaceFile = new CodeGeneratorResponse.File();
      msgInterfaceFile.setName(msgFileName + '.interface.ts');
      interfaces.push(msgFileName + '.interface');
      msgInterfaceFile.setContent(
        ProtoMsgInterfaceFormatter.format(fileNameToDescriptor[fileName], exportMap)
      );
      codeGenResponse.addFile(msgInterfaceFile);

      let msgTsdFile = new CodeGeneratorResponse.File();
      msgTsdFile.setName(msgFileName + '.d.ts');
      const msgModel = ProtoMsgTsdFormatter.format(fileNameToDescriptor[fileName], exportMap);
      msgTsdFile.setContent(TplEngine.render('msg_tsd', msgModel));
      codeGenResponse.addFile(msgTsdFile);

      // service part
      let fileDescriptorModel = ProtoSvcTsdFormatter.format(
        fileNameToDescriptor[fileName],
        exportMap
      );
      if (fileDescriptorModel != null) {
        let svcFileName = Utility.svcFilePathFromProtoWithoutExt(fileName);
        let svtTsdFile = new CodeGeneratorResponse.File();
        svtTsdFile.setName(svcFileName + '.d.ts');
        svtTsdFile.setContent(TplEngine.render('svc_tsd', fileDescriptorModel));
        codeGenResponse.addFile(svtTsdFile);
        fileList.push(svcFileName);
      }

      return fileList;
    }, []);

    const indexJsOutput = ProtoIndexFormatter.format(files, 'index_js');
    const indexJsFile = new CodeGeneratorResponse.File();
    indexJsFile.setName('index.js');
    indexJsFile.setContent(indexJsOutput);
    codeGenResponse.addFile(indexJsFile);

    const indexTsOutput = ProtoIndexFormatter.format(files, 'index_tsd');
    const indexTsdFile = new CodeGeneratorResponse.File();
    indexTsdFile.setName('index.d.ts');
    indexTsdFile.setContent(indexTsOutput);
    codeGenResponse.addFile(indexTsdFile);

    const interfaceTsOutput = ProtoIndexFormatter.format(interfaces, 'index_tsd');
    const interfaceTsdFile = new CodeGeneratorResponse.File();
    interfaceTsdFile.setName('interfaces.ts');
    interfaceTsdFile.setContent(interfaceTsOutput);
    codeGenResponse.addFile(interfaceTsdFile);

    const noGrpcFiles = (filename: string) => !filename.includes('grpc');

    const modelJsOutput = ProtoIndexFormatter.format(files.filter(noGrpcFiles), 'index_js');
    const modelJsFile = new CodeGeneratorResponse.File();
    modelJsFile.setName('models.js');
    modelJsFile.setContent(modelJsOutput);
    codeGenResponse.addFile(modelJsFile);

    const modelTsOutput = ProtoIndexFormatter.format(files.filter(noGrpcFiles), 'index_tsd');
    const modelTsdFile = new CodeGeneratorResponse.File();
    modelTsdFile.setName('models.d.ts');
    modelTsdFile.setContent(modelTsOutput);
    codeGenResponse.addFile(modelTsdFile);

    process.stdout.write(new Buffer(codeGenResponse.serializeBinary()));
  } catch (err) {
    console.error('protoc-gen-ts error: ' + err.stack + '\n');
    process.exit(1);
  }
});
