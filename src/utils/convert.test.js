import { describe, it, expect } from 'vitest';
import { convert, formatResult } from './convert';

describe('convert', () => {
  describe('length conversions', () => {
    it('should convert meters to kilometers', () => {
      const result = convert(1000, 'm', 'km', 'length');
      expect(result).toBe(1);
    });

    it('should convert kilometers to meters', () => {
      const result = convert(1, 'km', 'm', 'length');
      expect(result).toBe(1000);
    });

    it('should convert centimeters to inches', () => {
      const result = convert(2.54, 'cm', 'inch', 'length');
      expect(result).toBeCloseTo(1, 5);
    });

    it('should convert miles to kilometers', () => {
      const result = convert(1, 'mi', 'km', 'length');
      expect(result).toBeCloseTo(1.609344, 5);
    });

    it('should return same value when converting to same unit', () => {
      const result = convert(100, 'm', 'm', 'length');
      expect(result).toBe(100);
    });
  });

  describe('weight conversions', () => {
    it('should convert kilograms to grams', () => {
      const result = convert(1, 'kg', 'g', 'weight');
      expect(result).toBe(1000);
    });

    it('should convert pounds to kilograms', () => {
      const result = convert(1, 'lb', 'kg', 'weight');
      expect(result).toBeCloseTo(0.453592, 5);
    });

    it('should convert ounces to grams', () => {
      const result = convert(1, 'oz', 'g', 'weight');
      expect(result).toBeCloseTo(28.3495, 3);
    });
  });

  describe('temperature conversions', () => {
    it('should convert Celsius to Fahrenheit', () => {
      const result = convert(0, 'c', 'f', 'temperature');
      expect(result).toBe(32);
    });

    it('should convert Celsius to Fahrenheit (100°C)', () => {
      const result = convert(100, 'c', 'f', 'temperature');
      expect(result).toBe(212);
    });

    it('should convert Fahrenheit to Celsius', () => {
      const result = convert(32, 'f', 'c', 'temperature');
      expect(result).toBeCloseTo(0, 5);
    });

    it('should convert Celsius to Kelvin', () => {
      const result = convert(0, 'c', 'k', 'temperature');
      expect(result).toBeCloseTo(273.15, 5);
    });

    it('should convert Kelvin to Celsius', () => {
      const result = convert(273.15, 'k', 'c', 'temperature');
      expect(result).toBeCloseTo(0, 5);
    });

    it('should convert Fahrenheit to Kelvin', () => {
      const result = convert(32, 'f', 'k', 'temperature');
      expect(result).toBeCloseTo(273.15, 5);
    });

    it('should convert Kelvin to Fahrenheit', () => {
      const result = convert(273.15, 'k', 'f', 'temperature');
      expect(result).toBeCloseTo(32, 5);
    });

    it('should return same value when converting temperature to same unit', () => {
      const result = convert(25, 'c', 'c', 'temperature');
      expect(result).toBe(25);
    });

    it('should handle negative temperatures', () => {
      const result = convert(-40, 'c', 'f', 'temperature');
      expect(result).toBe(-40); // -40°C = -40°F
    });
  });

  describe('time conversions', () => {
    it('should convert hours to minutes', () => {
      const result = convert(1, 'h', 'min', 'time');
      expect(result).toBe(60);
    });

    it('should convert days to hours', () => {
      const result = convert(1, 'd', 'h', 'time');
      expect(result).toBe(24);
    });

    it('should convert weeks to days', () => {
      const result = convert(1, 'week', 'd', 'time');
      expect(result).toBe(7);
    });
  });

  describe('data conversions', () => {
    it('should convert megabytes to kilobytes', () => {
      const result = convert(1, 'mb', 'kb', 'data');
      expect(result).toBe(1024);
    });

    it('should convert gigabytes to megabytes', () => {
      const result = convert(1, 'gb', 'mb', 'data');
      expect(result).toBe(1024);
    });

    it('should convert bytes to bits', () => {
      const result = convert(1, 'b', 'bit', 'data');
      expect(result).toBe(8);
    });
  });

  describe('edge cases', () => {
    it('should return empty string for empty value', () => {
      const result = convert('', 'm', 'km', 'length');
      expect(result).toBe('');
    });

    it('should return empty string for NaN value', () => {
      const result = convert('abc', 'm', 'km', 'length');
      expect(result).toBe('');
    });

    it('should return empty string for invalid category', () => {
      const result = convert(100, 'm', 'km', 'invalid');
      expect(result).toBe('');
    });

    it('should return empty string for invalid fromUnit', () => {
      const result = convert(100, 'invalid', 'km', 'length');
      expect(result).toBe('');
    });

    it('should return empty string for invalid toUnit', () => {
      const result = convert(100, 'm', 'invalid', 'length');
      expect(result).toBe('');
    });

    it('should handle zero value', () => {
      const result = convert(0, 'm', 'km', 'length');
      expect(result).toBe(0);
    });

    it('should handle negative values for non-temperature', () => {
      const result = convert(-100, 'm', 'km', 'length');
      expect(result).toBe(-0.1);
    });

    it('should handle decimal values', () => {
      const result = convert(1.5, 'km', 'm', 'length');
      expect(result).toBe(1500);
    });

    it('should handle string number values', () => {
      const result = convert('100', 'm', 'km', 'length');
      expect(result).toBe(0.1);
    });
  });
});

describe('formatResult', () => {
  it('should format number with up to 2 decimal places', () => {
    const result = formatResult(1.234);
    expect(result).toBe('1.23');
  });

  it('should remove trailing zeros', () => {
    const result = formatResult(1.10);
    expect(result).toBe('1.1');
  });

  it('should handle whole numbers', () => {
    const result = formatResult(100);
    expect(result).toBe('100');
  });

  it('should handle very small numbers', () => {
    const result = formatResult(0.001);
    expect(result).toBe('0');
  });

  it('should return empty string for empty value', () => {
    const result = formatResult('');
    expect(result).toBe('');
  });

  it('should return empty string for null', () => {
    const result = formatResult(null);
    expect(result).toBe('');
  });

  it('should return empty string for undefined', () => {
    const result = formatResult(undefined);
    expect(result).toBe('');
  });

  it('should return empty string for NaN string', () => {
    const result = formatResult('abc');
    expect(result).toBe('');
  });

  it('should handle negative numbers', () => {
    const result = formatResult(-5.678);
    expect(result).toBe('-5.68');
  });

  it('should handle zero', () => {
    const result = formatResult(0);
    expect(result).toBe('0');
  });

  it('should handle string numbers', () => {
    const result = formatResult('123.456');
    expect(result).toBe('123.46');
  });
});
