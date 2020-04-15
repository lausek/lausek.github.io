document.addEventListener('DOMContentLoaded', function() {
    let methodre = /(\+|#|-|~)\s*(\S+)\(([^\)]*)[\)\s:]*(\S+)?/;
    let attributere = /(\+|#|-|~)\s*(\S+)[\s:]*(\S+)/;

    class Method {
        constructor(vis, name, ret, args) {
            this.vis = vis;
            this.name = name;
            this.ret = ret;
            this.args = args;
        }

        generate() {
            let vis = generate_vis(this.vis);
            let args = generate_args(this.args);
            let ret = generate_return_ty(this.ret);
            return `${vis} ${ret} ${this.name}(${args}) {}`;
        }
    }

    class Attribute {
        constructor(vis, name, ty) {
            this.vis = vis;
            this.name = name;
            this.ty = ty;
        }

        generate() {
            let vis = generate_vis(this.vis);
            let ty = generate_return_ty(this.ty);
            return `${vis} ${ty} ${this.name};`;
        }
    }

    function parse_args(args) {
        let parsed = [];
        for(let arg of args.split(",")) {
            let split = arg.split(":");
            let name = split[0];
            let ty = split[1];
            parsed.push({ name: name, ty: ty });
        }
        return parsed;
    }

    function parse_method(line) {
        let match = methodre.exec(line);
        if(match === null) {
            return null;
        }
        let vis = match[1];
        let name = match[2];
        let args = match[3];
        let ret = match[4];

        console.log(vis, name, args, ret);

        return new Method(vis, name, ret, args ? parse_args(args) : undefined);
    }

    function parse_attribute(line) {
        let match = attributere.exec(line);
        if(match === null) {
            return null;
        }
        let vis = match[1];
        let name = match[2];
        let ty = match[3];

        return new Attribute(vis, name, ty);
    }

    function is_attribute(line) {
        return line.exec() !== null;
    }

    function parse_line(line) {
        let method = parse_method(line);
        if(method === null) {
            return parse_attribute(line);
        }
        return method;
    }

    function parse(src) {
        let parsed = [];
        for(let line of src.split('\n')) {
            parsed.push(parse_line(line));
        }
        return parsed;
    }

    function generate_args(args) {
        if(args === null || args === undefined) {
            return '';
        }

        let code = '';
        for(let arg of args) {
            if(code) {
                code += ', ';
            }
            console.log(arg);
            code += `${arg['ty']} ${arg['name']}`;
        }
        return code;
    }

    function generate_vis(vis) {
        return {
            '+': 'public',
            '-': 'private',
            '#': 'protected',
            '~': '<not mapped>',
        }[vis]
    }

    function generate_return_ty(ret) {
        if(ret === undefined || ret === null) {
            return 'void';
        }
        return ret;
    }

    function generate(parsed) {
        let code = '';

        for(let entity of parsed) {
            if(entity === null) {
                console.log('error on line x');
                continue;
            }

            code += entity.generate();
            code += '\n';
        }

        return code;
    }

    function on_change(evt) {
        let target = evt.target;
        let src = target.value;

        let parsed = parse(src);
        let code = generate(parsed);

        document.getElementById('out').value = code;
    }

    document.getElementById('in').onchange = on_change;
});
