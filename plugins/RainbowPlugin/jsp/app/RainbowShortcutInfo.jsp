<%@page import="com.jalios.jcmsplugin.openrainbow.ui.openRainbowAppHandler"%>
<%@ page contentType="text/html; charset=UTF-8" %><%
%><%@ include file="/jcore/doInitPage.jspf" %>

<jsp:useBean id='formHandler' scope='page' class='com.jalios.jcmsplugin.openrainbow.component.RainbowAsyncShortcutHandler'><%
%><jsp:setProperty name="formHandler" property="pageContext" value="<%= pageContext %>"/><%
%><jsp:setProperty name='formHandler' property='*' /><%
%></jsp:useBean><%
%><%= formHandler.getJsonResponse() %>