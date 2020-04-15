document.addEventListener('DOMContentLoaded', function() {
    let umlre = /(\+|#|-|~)(\S+)\(([^\)]*)[\)\s:]*(\S+)?/;

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

    function parse_line(line) {
        let match = umlre.exec(line);
        if(match === null)
        {
            return null;
        }
        let vis = match[1];
        let name = match[2];
        let args = match[3];
        let ret = match[4];

        console.log(vis, name, args, ret);

        return {
            visibility: vis,
            name: name,
            args: args ? parse_args(args) : undefined,
            ret: ret,
        };
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

        for(let signature of parsed) {
            if(signature === null) {
                console.log('error on line x');
                continue;
            }

            let vis = generate_vis(signature['visibility']);
            let args = generate_args(signature['args']);
            let ret = generate_return_ty(signature['ret']);
            code += `${vis} ${ret} ${signature['name']}(${args}) {}`;
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
