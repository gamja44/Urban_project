	package com.gudee.urban.dto;
	
	import lombok.Data;
	
	import java.time.LocalDate;
	
	@Data
	public class ApartmentData {
	
	    private Long id;
	    private String year;       //기준년도
	    private int dealAmount;		//거래금액				
	    private String legalDongName;  //법정동명
	    private int floor;		//층수	
	    private String lotNumber;  // 번지
	    private String apartmentName;  //아파트이름
	    private String buildYear;   //건축년도
	    private String referenceDay;  //기준일
	    private String referenceMonth;  //기준월
	    private double exclusiveArea;	//전용면적
	    private double xCoordinate;
	    private double yCoordinate;
	
	}
	
