"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DependencyFilter_1 = require("../DependencyFilter");
const TplEngine_1 = require("../TplEngine");
const Utility_1 = require("../Utility");
const WellKnown_1 = require("../WellKnown");
const EnumFormatter_1 = require("./partial/EnumFormatter");
const ExtensionFormatter_1 = require("./partial/ExtensionFormatter");
const MessageFormatter_1 = require("./partial/MessageFormatter");
var ProtoMsgInterfaceFormatter;
(function (ProtoMsgInterfaceFormatter) {
    function format(descriptor, exportMap) {
        let fileName = descriptor.getName();
        let packageName = descriptor.getPackage();
        let imports = [];
        let messages = [];
        let extensions = [];
        let enums = [];
        let upToRoot = Utility_1.Utility.getPathToRoot(fileName);
        descriptor.getDependencyList().forEach((dependency) => {
            if (DependencyFilter_1.DependencyFilter.indexOf(dependency) !== -1) {
                return; // filtered
            }
            let pseudoNamespace = Utility_1.Utility.filePathToPseudoNamespace(dependency);
            if (dependency in WellKnown_1.WellKnownTypesMap) {
                imports.push(`import * as ${pseudoNamespace} from "${WellKnown_1.WellKnownTypesMap[dependency]}";`);
            }
            else {
                let filePath = Utility_1.Utility.filePathFromProtoWithoutExt(dependency);
                imports.push(`import * as ${pseudoNamespace} from "${upToRoot}${filePath}.interface";`);
            }
        });
        descriptor.getMessageTypeList().forEach(enumType => {
            messages.push(MessageFormatter_1.MessageFormatter.format(fileName, exportMap, enumType, "", descriptor, true));
        });
        descriptor.getExtensionList().forEach(extension => {
            extensions.push(ExtensionFormatter_1.ExtensionFormatter.format(fileName, exportMap, extension, ""));
        });
        descriptor.getEnumTypeList().forEach(enumType => {
            enums.push(EnumFormatter_1.EnumFormatter.format(enumType, ""));
        });
        return TplEngine_1.TplEngine.render('msg_tsd', {
            packageName: packageName,
            fileName: fileName,
            imports: imports,
            messages: messages,
            extensions: extensions,
            enums: enums,
        });
    }
    ProtoMsgInterfaceFormatter.format = format;
})(ProtoMsgInterfaceFormatter = exports.ProtoMsgInterfaceFormatter || (exports.ProtoMsgInterfaceFormatter = {}));
//# sourceMappingURL=ProtoMsgInterfaceFormatter.js.map