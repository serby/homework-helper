{{!Switch delimiter to `<%` not `{{` to allow Stylus' built in {$foo} to work}}
{{=<% %>=}}
//
// Do not make changes to this file – they may be automatically overridden.
// Last generated: <%date%>
//


//
// `@block` for each icon to be extended throughout the site
// Docs: http://learnboost.github.io/stylus/docs/block.html
//

<%#svg%>
<%#selector.0%>$<%expression%><%/selector.0%> =
<%#sprite%>
  background-position (<%positionX%>px - <%padding%>) (<%positionY%>px - <%padding%>)
  width <%width%>px
  height <%height%>px
<%/sprite%>

<%/svg%>

//
// Create modified selectors which call `@block`s
//

<%#svg%>
<%#selector.0%><%replacedExpression%><%/selector.0%>
<%#sprite%>
  {<%#selector.0%>$<%expression%><%/selector.0%>}
<%/sprite%>

<%/svg%>
