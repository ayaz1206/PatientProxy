import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import axios from 'axios';
import { of } from 'rxjs'; // RxJS library for mocking

jest.mock('axios'); // Mock axios for API calls

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent], // Correctly declaring the component
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'patientproxy-bot'`, () => {
    expect(component.title).toEqual('patientproxy-bot');
  });

  it('should render title in an h1 tag', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, patientproxy-bot');
  });

  it('should initialize bot details on creation', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { results: [{ name: { first: 'John', last: 'Doe' }, dob: { age: 30 } }] }
    });

    await component.getRandomBotDetails(); // Call the method to fetch bot details

    expect(component.botName).toBe('John Doe');
    expect(component.botAge).toBe(30);
    expect(component.messages[0].text).toContain('Hello Doctor, I\'m your patient.');
  });

  it('should send message and get a response', () => {
    component.userMessage = 'How are you feeling?'; // Set the user's message
    component.sendMessage(); // Simulate sending the message

    // Check if a bot response is generated
    expect(component.messages.length).toBe(2); // User + Bot message
    expect(component.messages[1].text).toContain('I am currently experiencing symptoms');
  });

  it('should handle emotion response', () => {
    component.userMessage = 'I feel pain'; // Set the user's message
    component.sendMessage(); // Simulate sending the message

    // Check if the emotion is correctly identified in the response
    expect(component.messages[1].emotion).toBe('pain'); // Ensure the emotion is correctly set
  });
});
