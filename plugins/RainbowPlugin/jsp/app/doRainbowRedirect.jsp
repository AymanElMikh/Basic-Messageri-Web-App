<%@page import="java.io.Console"%>
<%@page import="com.jalios.jcms.HttpUtil"%>
<%@ include file='/jcore/doInitPage.jspf'%>
<%@ include file="/front/app/doAppCommon.jspf"%>

<%@ page import="com.jalios.jcmsplugin.openrainbow.ui.openRainbowAppHandler" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>

<jsp:useBean id="loginHandler" scope="page" class="com.jalios.jcmsplugin.openrainbow.ui.openRainbowAppHandler">
  <jsp:setProperty name="loginHandler" property="request" value="<%= request %>" />
  <jsp:setProperty name="loginHandler" property="response" value="<%= response %>" />
  <jsp:setProperty name="loginHandler" property="*" />
</jsp:useBean>

<head>
    <link rel="stylesheet" href="plugins/RainbowPlugin/css/load.css">
</head>

<script 
src="https://code.jquery.com/jquery-3.7.1.slim.js" 
integrity="sha256-UgvvN8vBkgO0luPSUl2s8TIlOSYRoGFAX4jlCIm9Adc=" 
crossorigin="anonymous"></script>

<%

jcmsContext.setPageTitle("Rainbow Laoding");
jcmsContext.addCSSHeader("plugins/RainbowPlugin/css/load.css");
jcmsContext.addJavaScript("plugins/RainbowPlugin/js/fetchToken.js");

String redirectedFromRainbowUrl=loginHandler.getRedirectedFromRainbowUri();
String WebsiteURL=loginHandler.getWebsiteURL();

%>
<script 
type="text/javascript" src="plugins/RainbowPlugin/js/fetchToken.js"></script>

<script>
window.WebsiteURL = "<%= WebsiteURL %>";
</script>



    
<div class="ajax-refresh-div" data-jalios-ajax-refresh-url=<%= redirectedFromRainbowUrl %>

<%@ include file='/jcore/doHeader.jspf' %>

<div class="rainbow-loading-container">

  <div class="background-image-container">
    <img src="plugins/RainbowPlugin/images/rainbowBackground_1.jpg" alt="Loading background image">
  </div>

  <div class="progress-bar-container">
    <div class="progress-bar"></div>
  </div>
  
<div class="logo-container">
    <img class="rainbow-logo" src="plugins/RainbowPlugin/images/OpenRainbowLogo-nb.png" alt="Rainbow logo">
</div>


  <img class="alcatel-logo" src="plugins/RainbowPlugin/images/AlcatelLogo.png" alt="Alcatel logo">
  
  
</div>

<%@ include file='/jcore/doAjaxFooter.jspf' %>

</div>


<script>

</script>