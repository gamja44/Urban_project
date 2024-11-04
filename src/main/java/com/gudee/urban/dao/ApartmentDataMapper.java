package com.gudee.urban.dao;

import com.gudee.urban.dto.ApartmentData;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ApartmentDataMapper {

	@Select("SELECT id, year, deal_amount AS dealAmount, legal_dong_name AS legalDongName, floor, lot_number AS lotNumber, apartment_name AS apartmentName, build_year AS buildYear, reference_day AS referenceDay, reference_month AS referenceMonth, exclusive_area AS exclusiveArea, x_coordinate AS xCoordinate, y_coordinate AS yCoordinate FROM apartment_data limit 100")
	List<ApartmentData> findAll();


    // 아파트 데이터 삽입
    @Insert("INSERT INTO apartment_data (year, deal_amount, legal_dong_name, floor, lot_number, apartment_name, build_year, reference_day, reference_month, exclusive_area, x_coordinate, y_coordinate) " +
            "VALUES (#{year}, #{dealAmount}, #{legalDongName}, #{floor}, #{lotNumber}, #{apartmentName}, #{buildYear}, #{referenceDay}, #{referenceMonth}, #{exclusiveArea}, #{xCoordinate}, #{yCoordinate})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertApartmentData(ApartmentData apartmentData);
    
    // 중복 데이터 확인
    @Select("SELECT COUNT(*) FROM apartment_data WHERE year = #{year} AND deal_amount = #{dealAmount} AND legal_dong_name = #{legalDongName} AND lot_number = #{lotNumber} AND apartment_name = #{apartmentName} AND floor = #{floor}")
    int countExistingData(ApartmentData apartmentData);
}
