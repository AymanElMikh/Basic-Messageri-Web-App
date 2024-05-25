package com.jalios.jcmsplugin.openrainbow.component;

import com.jalios.jcms.shortcut.AsyncShortcutHandler;
import com.jalios.jcms.shortcut.BadgeLevel;
import com.jalios.jcms.shortcut.ShortcutInfo;
import com.jalios.jcmsplugin.openrainbow.ui.openRainbowAppHandler;

public class RainbowAsyncShortcutHandler extends AsyncShortcutHandler {
	
    private openRainbowAppHandler appHandler; // Assuming loginHandler is an instance managing the counts

    // Constructor or a method to set the loginHandler instance
    public RainbowAsyncShortcutHandler(openRainbowAppHandler appHandler) {
        this.appHandler = appHandler;
    }

	@Override
	public ShortcutInfo getShortcutInfo() {
		
		int count = appHandler.getCurrentInvitationsCount();
	    if (count == 0) {
	      return null;
	    }
	    System.out.println("*****************************"+count);
	    ShortcutInfo info = new ShortcutInfo();
	    info.setBadgeText(String.valueOf(count));
	    info.setBadgeLevel(BadgeLevel.INFO);
	    info.setUrl("plugins/RainbowPlugin/jsp/app/Rainbow.jsp");
	    return info;
	}

}
