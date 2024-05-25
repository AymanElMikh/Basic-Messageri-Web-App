package com.jalios.jcmsplugin.openrainbow.component;

import com.jalios.jcms.Channel;
import com.jalios.jcms.shortcut.AbstractShortcut;
import com.jalios.jcms.shortcut.BasicShortcutPolicyFilter;

public class RainbowShortcutPolicyFilter extends BasicShortcutPolicyFilter{
	
	@Override
	  public String getShortcutInfoAsync(AbstractShortcut shortcut) {
	    if (shortcut != Channel.getChannel().getData("$id.shortcut.jcmsplugin.Rainbow")) {
	      return null;
	    }
	    System.out.println("*****************************");
	    return "plugins/RainbowPlugin/jsp/app/RainbowShortcutInfo.jsp";
	  }
}
