package com.acronexus.entity;
public enum BloodGroup { A_PLUS("A+"), A_MINUS("A-"), B_PLUS("B+"), B_MINUS("B-"), AB_PLUS("AB+"), AB_MINUS("AB-"), O_PLUS("O+"), O_MINUS("O-");
private String value;
BloodGroup(String value){this.value = value;}
public String getValue(){return value;} }