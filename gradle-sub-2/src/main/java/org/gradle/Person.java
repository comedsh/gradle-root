package org.gradle;

import org.apache.commons.collections.list.GrowthList;

public class Person implements PersonInterface{
    private final String name;

    public Person(String name) {
        this.name = name;
        new GrowthList();
    }

    public String getName() {
        return name;
    }
    
    /*
     * (non-Javadoc)
     * @see org.gradle.InterfaceSub1#getNickName()
     */
	public String getNickName() {
		return null;
	}
}