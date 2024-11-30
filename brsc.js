function initBrsc(styleSheets) {
    var code = ""
    for (var i = 0; i < styleSheets.length; i++) {
        if (styleSheets[i].nodeName == "STYLE"){
            code += styleSheets[i].innerHTML
        }
        if (styleSheets[i].nodeName == "BRSC"){
            code += styleSheets[i].innerHTML
            styleSheets[i].style.display = "none"
        }
    }
    return code
}

function color(args) {
    var val = ""
    if (args[0] == "red") {
        val = "red"
    }
    if (args[0] == "lred") {
        val = "#FFCCCB"
    }
    if (args[0] == "dred") {
        val = "darkred"
    }
    
    if (args[0] == "blue") {
        val = "blue"
    }
    if (args[0] == "lblue") {
        val = "lightBlue"
    }
    if (args[0] == "dblue") {
        val = "darkBlue"
    }
    
    if (args[0] == "green") {
        val = "green"
    }
    if (args[0] == "lgreen") {
        val = "lightGreen"
    }
    if (args[0] == "dgreen") {
        val = "darkGreen"
    }
    return val
}

function toc(line) {
    var sectors = line.split(/[ {}]+/)
    var command = ""
    var open = line.split("{").length-1
    var close = line.split("}").length-1
    var args = []
    for (var i = 0; i < sectors.length; i++) {
        if(sectors[i].length != 0) {
            if(command=="") {
                switch (sectors[i]) {
                    case "width":
                        command = "width"
                        break;
                    case "height":
                        command = "height"
                        break;
                    case "color":
                        command = "color"
                        break;
                    case "bcolor":
                        command = "bcolor"
                        break;
                    case "size":
                        command = "size"
                        break;
                    case "fonts":
                        command = "fonts"
                        break;
                    case "margin":
                        command = "margin"
                        break;
                }
                if (sectors[i][0] == '#') {
                    command = sectors[i]
                }else if (sectors[i][0] == '$') {
                    command = sectors[i]
                }
            }else{
                args.push(sectors[i])
            }
        }
    }
    return [command, args, open, close]
}

function eval(args, com, ell) {
    if(com == "width") {
        var val = 0
        if (args[0].endsWith("%")) {
            val = ell.parentElement.offsetWidth * parseInt(args[0].replace("%","")) / 100
        }
        if (args[0].endsWith("%w")) {
            val = ell.parentElement.offsetWidth * parseInt(args[0].replace("%w","")) / 100
        }
        if (args[0].endsWith("%h")) {
            val = ell.parentElement.offsetHeight * parseInt(args[0].replace("%h","")) / 100
        }
        ell.style.width = val + "px"
    }else if(com == "height") {
        var val = 0
        if (args[0].endsWith("%")) {
            val = ell.parentElement.offsetHeight * parseInt(args[0].replace("%","")) / 100
        }
        if (args[0].endsWith("%w")) {
            val = ell.parentElement.offsetWidth * parseInt(args[0].replace("%w","")) / 100
        }
        if (args[0].endsWith("%h")) {
            val = ell.parentElement.offsetHeight * parseInt(args[0].replace("%h","")) / 100
        }
        ell.style.height = val + "px"
    }else if(com == "color") {
        ell.style.color = color(args)
        console.log(ell.style.color);
        
    }else if(com == "bcolor") {
        ell.style.backgroundColor = color(args)
    }else if(com == "size") {
        if(args[0] == "match") {
            ell.style.width = ell.parentElement.offsetWidth + "px"
            ell.style.height = ell.parentElement.offsetHeight + "px"
            
        }
    } else if(com == "fonts") {
        if (args[0] == "fit") {
            if (ell.parentElement.offsetHeight > ell.parentElement.offsetWidth) {
                ell.style.fontSize = ell.parentElement.offsetWidth + "px"
            }else {
                ell.style.fontSize = ell.parentElement.offsetHeight + "px"
            }
        }
    }else if(com == "margin") {
        if (args[0] == "none") {
            ell.style.margin = "0px"
        }else{
            var val = 0
            if (args[0].endsWith("%")) {
                val = ell.parentElement.offsetHeight * parseInt(args[0].replace("%","")) / 100
            }
            if (args[0].endsWith("%w")) {
                val = ell.parentElement.offsetWidth * parseInt(args[0].replace("%w","")) / 100
            }
            if (args[0].endsWith("%h")) {
                val = ell.parentElement.offsetHeight * parseInt(args[0].replace("%h","")) / 100
            }
            if (args[0].endsWith("px")) {
                val = args.replace("px","")
            }
            ell.margin = val+"px"
        }
    }
}

function run(command, obj, t) {
    if (command[0][0] == "#"){
        obj = command[0].replace("#","")
        t=0
    } else if (command[0][0] == "$"){
        obj = command[0].replace("$","")
        t=1
    } else {
        if(t == 0) {
            o = document.getElementById(obj)
            eval(command[1], command[0], o)
        }
    }
    return [obj, t]
}

onload = ((window, event) => {
    document.getElementsByTagName("body")[0].style.width = "100vw"
    document.getElementsByTagName("body")[0].style.height = "100vh"
    var styleSheets = [];
    var s = document.getElementsByTagName("style")
    for (var i = 0; i < s.length; i++) {
        if(s[i].getAttribute("type") == "text/brsc") {
            try {
                styleSheets.push(s[i])
            } catch {

            }
        }
    }
    var s = document.getElementsByTagName("brsc")
    for (var i = 0; i < s.length; i++) {
        try {
            styleSheets.push(s[i])
        } catch {

        }
    }
    var t = initBrsc(styleSheets)
    obj = -1
    tt = -1
    for (var i = 0; i < t.split("\n").length; i++) {
        [obj, tt] = run(toc(t.split("\n")[i]), obj, tt);
    }
})
onresize = onload