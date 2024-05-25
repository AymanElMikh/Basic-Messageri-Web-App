<%@page import="com.jalios.jcmsplugin.openrainbow.ui.openRainbowAppHandler"%>
<%@ page contentType="text/html; charset=UTF-8" %><%
%><%@ include file="/jcore/doInitPage.jspf" %>


<%

openRainbowAppHandler appHandler = (openRainbowAppHandler)request.getAttribute("rainbow.appHandler");

if (appHandler == null) {
      return;
    }
%>
<jsp:useBean id='formHandler' scope='page' class='com.jalios.jcmsplugin.openrainbow.component.RainbowAsyncShortcutHandler'><%
%><jsp:setProperty name="formHandler" property="appHandler" value='<%= appHandler %>' /><%
%><jsp:setProperty name="formHandler" property="pageContext" value="<%= pageContext %>"/><%
%><jsp:setProperty name='formHandler' property='*' /><%
%></jsp:useBean><%
%><%= formHandler.getJsonResponse() %>