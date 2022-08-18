const d = document;
d.id = (id) => {
    return d.getElementById(id)
};
d.create = (tag, objs, parent) => {
    var c = d.createElement(tag);
    //for (var attr in objs) c[attr] ? c.setAttribute(attr, objs[attr]) : (c[attr] = objs[attr]);
    if (objs)
        for (var attr in objs){
        	if(c[attr]){
        	 	c.setAttribute(attr, objs[attr])
        	}else{
        		c[attr] = objs[attr];
        		c.setAttribute(attr, objs[attr])
        	}
        } 
    if (parent) parent.append(c);
    return c
};
d.autoLoadId = () => {
    var globals = d.querySelectorAll('[id]');

    function toTitleCase(str) {
        var c = str.replace(/(\w+)/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        }).replace(/([^\w])/g, '');
        return c.charAt(0).toLowerCase() + c.substr(1);
    };
    globals.forEach(e => {
        var id = toTitleCase(e.id);
        window[id] = d.id(e.id)
        window[id].q = window[id].querySelector
        window[id].qAll = window[id].querySelectorAll
    })
}
d.q = d.querySelector;
d.qAll = d.querySelectorAll;

d.fns = []
d.init = function(cb){
    if(cb) 
        d.fns.push(cb)
}
d.loadFns = function(){
    d.fns.map(i=>{
        i()
    })
}
window.addEventListener('load',()=>{
    d.autoLoadId()
    d.loadFns()
})