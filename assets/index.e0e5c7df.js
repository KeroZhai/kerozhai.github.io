import{a as f,A as y,m as B,e as a,o as e,c as r,r as c,B as p,h,w as k,C as T,b as $,F as d,D as b,z as v,E as x,f as u,t as _}from"./vendor.e4be2b39.js";import{f as C}from"./index.bbbe1dee.js";const z=["href"],D=f({props:{to:null},setup(n){const i=n,o=y(()=>typeof i.to=="string"&&i.to.startsWith("http"));return(t,s)=>{const l=B("router-link");return a(o)?(e(),r("a",p({key:0},t.$attrs,{href:n.to,target:"_blank"}),[c(t.$slots,"default")],16,z)):(e(),h(l,T(p({key:1},t.$props)),{default:k(()=>[c(t.$slots,"default")]),_:3},16))}}}),E={class:"prose m-auto"},N=v(" Nothing here yet! "),w={class:"text-lg"},F={class:"opacity-50 text-sm -mt-1"},R=f({setup(n){$({title:"Blog - Keroz"});const o=x().getRoutes().filter(({path:t})=>t.startsWith("/posts")&&t!=="/posts").sort((t,s)=>t.meta.updatedTimestamp-s.meta.updatedTimestamp).map(t=>{const{title:s}=t.meta.frontmatter;return{title:s||t.name,link:t.path,updatedTime:t.meta.updatedTime}});return(t,s)=>{const l=D;return e(),r("div",E,[a(o).length===0?(e(),r(d,{key:0},[N],64)):(e(!0),r(d,{key:1},b(a(o),(m,g)=>(e(),h(l,{key:g,to:m.link,class:"item block font-normal mb-6 mt-2 no-underline"},{default:k(()=>[u("div",w,_(m.title),1),u("div",F,_(a(C)(m.updatedTime)),1)]),_:2},1032,["to"]))),128))])}}});export{R as default};
