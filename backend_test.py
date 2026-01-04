import requests
import sys
import json
from datetime import datetime

class ResearchAgentAPITester:
    def __init__(self, base_url="https://research-chatbot-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_conversation_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_create_conversation(self):
        """Test creating a new conversation"""
        success, response = self.run_test(
            "Create Conversation",
            "POST",
            "chat/conversations",
            200,
            data={"title": "Test Research Conversation"}
        )
        if success and 'id' in response:
            self.test_conversation_id = response['id']
            print(f"   Created conversation with ID: {self.test_conversation_id}")
            return True
        return False

    def test_get_conversations(self):
        """Test getting all conversations"""
        success, response = self.run_test(
            "Get All Conversations",
            "GET",
            "chat/conversations",
            200
        )
        if success:
            print(f"   Found {len(response)} conversations")
            return True
        return False

    def test_send_message(self):
        """Test sending a message to a conversation"""
        if not self.test_conversation_id:
            print("❌ No conversation ID available for message test")
            return False

        success, response = self.run_test(
            "Send Message",
            "POST",
            "chat/message",
            200,
            data={
                "conversation_id": self.test_conversation_id,
                "content": "What is artificial intelligence?"
            }
        )
        if success:
            if 'user_message' in response and 'ai_message' in response:
                print(f"   User message: {response['user_message']['content'][:50]}...")
                print(f"   AI response: {response['ai_message']['content'][:50]}...")
                return True
        return False

    def test_get_conversation_messages(self):
        """Test getting messages from a conversation"""
        if not self.test_conversation_id:
            print("❌ No conversation ID available for messages test")
            return False

        success, response = self.run_test(
            "Get Conversation Messages",
            "GET",
            f"chat/conversations/{self.test_conversation_id}",
            200
        )
        if success:
            print(f"   Found {len(response)} messages in conversation")
            return True
        return False

    def test_delete_conversation(self):
        """Test deleting a conversation"""
        if not self.test_conversation_id:
            print("❌ No conversation ID available for delete test")
            return False

        success, response = self.run_test(
            "Delete Conversation",
            "DELETE",
            f"chat/conversations/{self.test_conversation_id}",
            200
        )
        if success:
            print(f"   Conversation deleted successfully")
            return True
        return False

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        success, response = self.run_test(
            "Invalid Endpoint (404)",
            "GET",
            "invalid/endpoint",
            404
        )
        return success

def main():
    print("🚀 Starting Research Agent API Tests")
    print("=" * 50)
    
    tester = ResearchAgentAPITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("Create Conversation", tester.test_create_conversation),
        ("Get Conversations", tester.test_get_conversations),
        ("Send Message", tester.test_send_message),
        ("Get Conversation Messages", tester.test_get_conversation_messages),
        ("Delete Conversation", tester.test_delete_conversation),
        ("Invalid Endpoint", tester.test_invalid_endpoints),
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())