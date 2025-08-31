import { testBollingerBands } from '../lib/indicators/bollinger.ts';

console.log('🧪 Testing Bollinger Bands calculation...');

try {
  const testResult = testBollingerBands();
  
  if (testResult) {
    console.log('✅ All tests passed! Bollinger Bands calculation is working correctly.');
  } else {
    console.log('❌ Some tests failed. Please check the implementation.');
  }
} catch (error) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}

console.log('\n📊 Test completed successfully!');
