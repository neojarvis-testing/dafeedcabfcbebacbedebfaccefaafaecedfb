// edit-song.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EditSongComponent } from './edit-song.component';
import { SongService } from '../services/song.service';
import { Song } from '../model/song.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditSongComponent', () => {
  let component: EditSongComponent;
  let fixture: ComponentFixture<EditSongComponent>;
  let mockSongService: jasmine.SpyObj<SongService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockSongService = jasmine.createSpyObj('SongService', ['getSongById', 'updateSong']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      // declarations: [ EditSongComponent ],
      imports: [ ReactiveFormsModule, EditSongComponent, HttpClientTestingModule],
      providers: [
        { provide: SongService, useValue: mockSongService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSongComponent);
    component = fixture.componentInstance;
    
  });

  fit('should_create_edit_song_component', () => {
    expect(component).toBeTruthy();
  });

  fit('should_initialize_the_form_with_empty_fields', () => {
    mockSongService.getSongById.and.returnValue(of({} as Song));
    component.loadSongDetails();
    expect(component.songForm.value).toEqual({
      title: '',
      artist: '',
      album: '',
      genre: '',
      releaseDate: '',
      duration: ''
    });
  });

  fit('should_mark_form_as_invalid_when_empty', () => {
    mockSongService.getSongById.and.returnValue(of({} as Song));
    component.loadSongDetails();
    expect(component.songForm.valid).toBeFalsy();
  });

  fit('should_mark_form_as_valid_when_all_fields_are_filled_correctly', () => {
    mockSongService.getSongById.and.returnValue(of({} as Song));
    component.loadSongDetails();
    component.songForm.patchValue({
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      genre: 'Test Genre',
      releaseDate: '2023-01-15',
      duration: 180
    });
    expect(component.songForm.valid).toBeTruthy();
  });

  fit('should_navigate_to_songs_list_after_successful_update', (done) => {
    const mockSong: Song = {
      id: 1,
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      genre: 'Test Genre',
      releaseDate: '2023-01-15',
      duration: 180
    };

    mockSongService.getSongById.and.returnValue(of(mockSong));
    mockSongService.updateSong.and.returnValue(of(mockSong));

    component.loadSongDetails();
    component.songForm.patchValue({
      title: mockSong.title,
      artist: mockSong.artist,
      album: mockSong.album,
      genre: mockSong.genre,
      releaseDate: mockSong.releaseDate.toString().split('T')[0], // Convert to YYYY-MM-DD format
      duration: mockSong.duration
    });
    
    component.onSubmit();
    
    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/songs']);
      done();
    });
  });

  fit('should_not_call_updateSong_if_form_is_invalid', () => {
    mockSongService.getSongById.and.returnValue(of({} as Song));
    component.loadSongDetails();
    component.onSubmit();

    expect(mockSongService.updateSong).not.toHaveBeenCalled();
  });
});
